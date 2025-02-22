// tests/App.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { ref } from 'vue'
import App from '@/App.vue'
import { createTestingPinia } from '@pinia/testing'
import { useToastStore } from '@/stores/__mocks__/useToastStore'
import TheDrawer from '@/components/TheDrawer.vue'
import { useUserDataStore } from '@/stores/__mocks__/user'
import ModalComponent from '@/components/ModalComponent.vue'

// Mock the composables
vi.mock('@/stores/useToastStore')
vi.mock('@/stores/user')

const mockUseReadContract = {
  data: ref<string | null>(null),
  isLoading: ref(false),
  error: ref<unknown>(null),
  refetch: vi.fn()
}

const mockUseWriteContract = {
  writeContract: vi.fn(),
  error: ref<unknown>(null),
  isPending: ref(false),
  data: ref(null)
}

const mockUseWaitForTransactionReceipt = {
  isPending: ref(false),
  isSuccess: ref(false)
}

vi.mock('@wagmi/vue', async (importOriginal) => {
  const actual: Object = await importOriginal()
  return {
    ...actual,
    useReadContract: vi.fn(() => mockUseReadContract),
    useWriteContract: vi.fn(() => mockUseWriteContract),
    useWaitForTransactionReceipt: vi.fn(() => mockUseWaitForTransactionReceipt)
  }
})

describe('App.vue', () => {
  describe('Toast', () => {
    it('should add toast on balanceError', async () => {
      const wrapper = shallowMount(App, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn })]
        }
      })

      const { addErrorToast } = useToastStore()
      mockUseReadContract.error.value = new Error('Balance error')
      await wrapper.vm.$nextTick()

      expect(addErrorToast).toHaveBeenCalled()
    })

    it('should add toast on withdrawError', async () => {
      const wrapper = shallowMount(App, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn })]
        }
      })

      const { addErrorToast } = useToastStore()
      mockUseWriteContract.error.value = new Error('Balance error')
      await wrapper.vm.$nextTick()

      expect(addErrorToast).toHaveBeenCalledWith('Failed to withdraw tips')
    })

    it('should add toast on withdrawSuccess', async () => {
      const wrapper = shallowMount(App, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn })]
        }
      })
      mockUseWaitForTransactionReceipt.isPending.value = true
      await wrapper.vm.$nextTick()

      const { addSuccessToast } = useToastStore()
      mockUseWriteContract.error.value = null
      mockUseWaitForTransactionReceipt.isPending.value = false
      mockUseWaitForTransactionReceipt.isSuccess.value = true
      await wrapper.vm.$nextTick()

      expect(addSuccessToast).toHaveBeenCalledWith('Tips withdrawn successfully')
    })
  })

  describe('Actions', () => {
    it('should close drawer if close icon clicked', async () => {
      const wrapper = shallowMount(App, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn })]
        }
      })
      const { isAuth } = useUserDataStore()
      // set drawer to be open
      isAuth.value = true
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent(TheDrawer).exists()).toBeTruthy()

      await wrapper.find('div[data-test="drawer"]').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent(TheDrawer).exists()).toBeFalsy()
    })
  })

  describe('Render', () => {
    it('renders ModalComponent if showModal is true', async () => {
      const wrapper = shallowMount(App, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn })]
        }
      })

      await wrapper.setValue({ showModal: true })

      expect(wrapper.findComponent(ModalComponent).exists()).toBeTruthy()
    })
  })
})
