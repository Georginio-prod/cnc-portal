import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VotingManagement from '../VotingManagement.vue'
import { createTestingPinia } from '@pinia/testing'

import ModalComponent from '@/components/ModalComponent.vue'
import { ref } from 'vue'

interface ComponentData {
  transferOwnershipModal: boolean
}
vi.mock('@/stores/useToastStore', () => ({
  useToastStore: vi.fn().mockReturnValue({
    addErrorToast: vi.fn(),
    addSuccessToast: vi.fn()
  })
}))
const mockUseReadContract = {
  data: ref<string | null>('0x1234567890123456789012345678901234567890'),
  isLoading: ref(false),
  error: ref(null),
  refetch: vi.fn()
}

const mockUseWriteContract = {
  writeContract: vi.fn(),
  error: ref(null),
  isPending: ref(false),
  data: ref(null)
}

const mockUseWaitForTransactionReceipt = {
  isLoading: ref(false),
  isSuccess: ref(false)
}
const mockUseSendTransaction = {
  isPending: ref(false),
  error: ref(false),
  data: ref<string>(''),
  sendTransaction: vi.fn()
}
const mockUseBalance = {
  data: ref<string | null>(null),
  isLoading: ref(false),
  error: ref(null),
  refetch: vi.fn()
}

// Mocking wagmi functions
vi.mock('@wagmi/vue', async (importOriginal) => {
  const actual: Object = await importOriginal()
  return {
    ...actual,
    useReadContract: vi.fn(() => mockUseReadContract),
    useWriteContract: vi.fn(() => mockUseWriteContract),
    useWaitForTransactionReceipt: vi.fn(() => mockUseWaitForTransactionReceipt),
    useSendTransaction: vi.fn(() => mockUseSendTransaction),
    useBalance: vi.fn(() => mockUseBalance)
  }
})

describe('VotingManagement', () => {
  function createComponent() {
    return mount(VotingManagement, {
      props: {
        team: {
          votingAddress: '0x1234567890123456789012345678901234567890',
          boardOfDirectorsAddress: '0x0987654321098765432109876543210987654321'
        }
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: { address: '0x1234567890123456789012345678901234567890' }
            }
          })
        ]
      }
    })
  }

  describe('Renders', () => {
    it('renders correctly', () => {
      const wrapper = createComponent()
      expect(wrapper.find('div[data-test="title"]').text()).toBe('Manage Voting Contract')
      expect(wrapper.find('h3[data-test="status"]').text()).toBe('Status: Paused')
    })

    it('displays the correct voting contract status', async () => {
      const wrapper = createComponent()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('h3[data-test="status"]').text()).toBe('Status: Paused')
    })

    it('displays the correct voting contract owner', async () => {
      const wrapper = createComponent()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('div[data-test="owner"]').text()).toBe(
        '0x1234567890123456789012345678901234567890'
      )
    })

    it('shows transfer ownership button', () => {
      const wrapper = createComponent()
      expect(wrapper.find('button[data-test="transfer-ownership"]').text()).toBe(
        'Transfer Ownership'
      )
    })

    it('shows transfer to Board of Directors button', () => {
      const wrapper = createComponent()
      expect(wrapper.find('button[data-test="transfer-to-board-of-directors"]').text()).toBe(
        'Transfer to Board Of Directors Contract'
      )
    })

    it('shows ModalComponent when transferOwnership is clicked', async () => {
      const wrapper = createComponent()
      const transferOwnershipButton = wrapper.find('button[data-test="transfer-ownership"]')
      await transferOwnershipButton.trigger('click')
      expect(wrapper.findComponent(ModalComponent).exists()).toBeTruthy()
    })
  })

  describe('Emits', async () => {
    it('emits transferOwnership event', async () => {
      const wrapper = createComponent()
      const transferOwnershipButton = wrapper.find('button[data-test="transfer-ownership"]')
      await transferOwnershipButton.trigger('click')
      expect((wrapper.vm as unknown as ComponentData).transferOwnershipModal).toBeTruthy()
    })
  })
})
