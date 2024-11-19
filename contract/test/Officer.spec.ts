import { expect } from 'chai'
import { ethers, upgrades } from 'hardhat'
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import {
  Bank__factory,
  BoardOfDirectors__factory,
  ExpenseAccount__factory,
  Officer,
  Voting__factory,
  UpgradeableBeacon
} from '../typechain-types'

describe('Officer Contract', function () {
  let officer: Officer
  let bankAccount: Bank__factory
  let votingContract: Voting__factory
  let expenseAccount: ExpenseAccount__factory
  let bankAccountBeacon: UpgradeableBeacon
  let votingContractBeacon: UpgradeableBeacon
  let expenseAccountBeacon: UpgradeableBeacon
  let boardOfDirectors: BoardOfDirectors__factory
  let bodBeacon: UpgradeableBeacon
  let owner: SignerWithAddress
  let addr1: SignerWithAddress
  let addr2: SignerWithAddress
  let addr3: SignerWithAddress

  beforeEach(async function () {
    ;[owner, addr1, addr2, addr3] = await ethers.getSigners()

    // Deploy implementation contracts
    bankAccount = await ethers.getContractFactory('Bank')
    bankAccountBeacon = (await upgrades.deployBeacon(bankAccount)) as unknown as UpgradeableBeacon

    votingContract = await ethers.getContractFactory('Voting')
    votingContractBeacon = (await upgrades.deployBeacon(
      votingContract
    )) as unknown as UpgradeableBeacon

    boardOfDirectors = await ethers.getContractFactory('BoardOfDirectors')
    bodBeacon = (await upgrades.deployBeacon(boardOfDirectors)) as unknown as UpgradeableBeacon

    expenseAccount = await ethers.getContractFactory('ExpenseAccount')
    expenseAccountBeacon = (await upgrades.deployBeacon(
      expenseAccount
    )) as unknown as UpgradeableBeacon

    // Deploy Officer contract
    const Officer = await ethers.getContractFactory('Officer')
    officer = (await upgrades.deployProxy(Officer, [owner.address, []], {
      initializer: 'initialize'
    })) as unknown as Officer

    // Configure beacons
    await officer.connect(owner).configureBeacon('Bank', await bankAccountBeacon.getAddress())
    await officer.connect(owner).configureBeacon('Voting', await votingContractBeacon.getAddress())
    await officer.connect(owner).configureBeacon('BoardOfDirectors', await bodBeacon.getAddress())
    await officer
      .connect(owner)
      .configureBeacon('ExpenseAccount', await expenseAccountBeacon.getAddress())
  })

  describe('Team Management', () => {
    it('Should create a new team', async function () {
      const founders = [await addr1.getAddress(), await addr2.getAddress()]
      const members = [ethers.Wallet.createRandom().address]

      await expect(officer.connect(owner).createTeam(founders, members))
        .to.emit(officer, 'TeamCreated')
        .withArgs(founders, members)

      const [actualFounders, actualMembers] = await officer.getTeam()
      expect(actualFounders).to.deep.equal(founders)
      expect(actualMembers).to.deep.equal(members)
    })

    it('Should fail to create team without founders', async () => {
      await expect(officer.createTeam([], [])).to.be.revertedWith('Must have at least one founder')
    })
  })

  describe('Contract Deployment', () => {
    it('Should deploy contracts via BeaconProxy', async function () {
      const votingInitData = votingContract.interface.encodeFunctionData('initialize', [
        owner.address
      ])
      const bodInitData = boardOfDirectors.interface.encodeFunctionData('initialize', [
        [addr1.address, addr2.address]
      ])
      const bankInitData = bankAccount.interface.encodeFunctionData('initialize', [
        owner.address,
        owner.address
      ])
      const expenseInitData = expenseAccount.interface.encodeFunctionData('initialize', [
        owner.address
      ])

      await expect(
        officer
          .connect(owner)
          .deployBeaconProxy('Voting', await votingContractBeacon.getAddress(), votingInitData)
      ).to.emit(officer, 'ContractDeployed')

      await expect(
        officer
          .connect(owner)
          .deployBeaconProxy('BoardOfDirectors', await bodBeacon.getAddress(), bodInitData)
      ).to.emit(officer, 'ContractDeployed')

      await expect(
        officer
          .connect(owner)
          .deployBeaconProxy('Bank', await bankAccountBeacon.getAddress(), bankInitData)
      ).to.emit(officer, 'ContractDeployed')

      await expect(
        officer
          .connect(owner)
          .deployBeaconProxy(
            'ExpenseAccount',
            await expenseAccountBeacon.getAddress(),
            expenseInitData
          )
      ).to.emit(officer, 'ContractDeployed')
    })

    it('Should restrict deployment to owners and founders', async function () {
      await officer.connect(owner).createTeam([addr1.address], [])

      // Update the initialization data to use a valid owner address
      const initData = bankAccount.interface.encodeFunctionData('initialize', [
        addr1.address,
        owner.address
      ])

      // Test unauthorized access
      await expect(
        officer
          .connect(addr3)
          .deployBeaconProxy('Bank', await bankAccountBeacon.getAddress(), initData)
      ).to.be.revertedWith('You are not authorized to perform this action')

      // Test authorized access (founder)
      await expect(
        officer
          .connect(addr1)
          .deployBeaconProxy('Bank', await bankAccountBeacon.getAddress(), initData)
      ).to.emit(officer, 'ContractDeployed')
    })
  })

  describe('Access Control', () => {
    it('Should transfer ownership', async function () {
      await expect(officer.connect(owner).transferOwnership(addr1.address))
        .to.emit(officer, 'OwnershipTransferred')
        .withArgs(owner.address, addr1.address)

      expect(await officer.owner()).to.equal(addr1.address)
    })

    it('Should pause and unpause', async function () {
      await officer.connect(owner).pause()
      expect(await officer.paused()).to.be.true

      await officer.connect(owner).unpause()
      expect(await officer.paused()).to.be.false
    })

    it('Should restrict pause/unpause to owners', async function () {
      await expect(officer.connect(addr3).pause()).to.be.revertedWith(
        'You are not authorized to perform this action'
      )

      await expect(officer.connect(addr3).unpause()).to.be.revertedWith(
        'You are not authorized to perform this action'
      )
    })
  })
})
