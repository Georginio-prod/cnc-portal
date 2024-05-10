import { BrowserProvider /*, Signer */ } from 'ethers'
import { MetaMaskUtil } from '@/utils/web3Util'

// Define interface for web3 library
export interface IWeb3Library {
  initialize(): Promise<void>
  connectWallet(): Promise<void>
  requestSign(message: string): Promise<string>
  //getAddressRef(): Promise<Ref<string | null>>
  getAddress(): Promise<string>
  getProvider(): any
}

const metaMaskUtil = new MetaMaskUtil()

// Adapter for ethers.js
export class EthersJsAdapter implements IWeb3Library {
  private static instance: IWeb3Library | undefined
  private provider: any
  //private provider: ethers.providers.Web3Provider | null = null;
  //private signer: ethers.Signer | null = null;
  private signer: any
  /*private _address: Ref<string | null>

  constructor() {
    this._address = ref(null)
  }*/

  async initialize() {
    // Initialize provider
    const metaProvider = metaMaskUtil.getProvider()
    this.provider = new BrowserProvider(metaProvider)
    metaProvider.on('accountsChanged', async (/*accounts: string[]*/) => {
      this.signer = await this.provider.getSigner()
    })

    //this.signer = this.provider.getSigner();
  }

  async connectWallet(): Promise<void> {
    if (!this.provider) {
      //throw new Error('Ethers.js adapter is not initialized');
      this.initialize()
    }

    await metaMaskUtil.switchNetwork()

    await this.provider.send('eth_requestAccounts', [])

    // Get signer with connected wallet
    this.signer = this.provider.getSigner()
  }

  async requestSign(message: string): Promise<string> {
    if (!this.signer) {
      //throw new Error('Wallet is not connected')/;
      await this.connectWallet()
    }

    // Sign the message with signer's private key
    const signature = (await this.signer).signMessage(message)

    return signature
  }

  async getAddress() {
    if (!this.signer) {
      await this.connectWallet()
    }

    return (await this.signer).address
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EthersJsAdapter()
    }

    return this.instance
  }

  async getProvider() {
    if (!this.provider) {
      await this.connectWallet()
    }
    return this.provider
  }
}
