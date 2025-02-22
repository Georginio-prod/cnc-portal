import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BankTransactionsSection from '@/components/sections/SingleTeamView/BankTransactionsSection.vue'
import AccordionComponent from '@/components/AccordionComponent.vue'
import DepositHistory from '@/components/sections/SingleTeamView/tables/DepositHistory.vue'
import TransferHistory from '@/components/sections/SingleTeamView/tables/TransferHistory.vue'
import SendToWalletHistory from '@/components/sections/SingleTeamView/tables/SendToWalletHistory.vue'
import { createTestingPinia } from '@pinia/testing'

describe('BankTransactionsSection', () => {
  describe('Render', () => {
    it('renders correctly', () => {
      const wrapper = mount(BankTransactionsSection, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn })]
        },
        props: {
          bankAddress: '0x4b6Bf5cD91446408290725879F5666dcd9785F62'
        }
      })
      expect(wrapper.find('div#bank-transactions').exists()).toBe(true)

      expect(wrapper.findComponent(AccordionComponent).exists()).toBe(true)
      expect(wrapper.findComponent(DepositHistory).exists()).toBe(true)
      expect(wrapper.findComponent(TransferHistory).exists()).toBe(true)
      expect(wrapper.findComponent(SendToWalletHistory).exists()).toBe(true)
    })
  })

  describe('Actions', () => {
    it('should set activeAccordion to TransferHistory when click on TransferHistory accordion', async () => {
      const wrapper = mount(BankTransactionsSection, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn })]
        },
        props: {
          bankAddress: '0x4b6Bf5cD91446408290725879F5666dcd9785F62'
        }
      })

      // Click on TransferHistory accordion
      await wrapper.findAll('input[type="radio"]').at(1)!.trigger('click')
      interface ComponentData {
        activeAccordion: number
      }
      expect((wrapper.vm as unknown as ComponentData).activeAccordion).toBe(1)
    })
  })
})
