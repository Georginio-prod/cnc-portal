// import { shallowMount } from '@vue/test-utils'
// import { describe, expect, it, vi } from 'vitest'
// import { createTestingPinia } from '@pinia/testing'
// import SkeletonLoading from '@/components/SkeletonLoading.vue'
// import type { Result } from 'ethers'
// import { NETWORK } from '@/constant'
// import { useToastStore } from '@/stores/__mocks__/useToastStore'
// import TipWithdrawalTransactionsTable from '@/components/sections/TransactionsView/tables/TipWithdrawalTransactionsTable.vue'

// vi.mock('@/composables/tips')
// vi.mock('@/stores/useToastStore')

// const mockWindowOpen = vi.fn()
// window.open = mockWindowOpen

// describe('TipWithdrawalTransactionsTable', () => {
//   const createComponent = () => {
//     return shallowMount(TipWithdrawalTransactionsTable, {
//       global: {
//         plugins: [
//           createTestingPinia({
//             createSpy: vi.fn
//           })
//         ]
//       }
//     })
//   }

//   describe('Render', () => {
//     it('should show table when loading is false', () => {
//       const wrapper = createComponent()
//       expect(wrapper.find('[data-test="table-tip-withdrawal-transactions"]').exists()).toBeTruthy()
//     })

//     it('should not show SkeletonLoading when loading is false', () => {
//       const wrapper = createComponent()
//       expect(wrapper.findComponent(SkeletonLoading).exists()).toBeFalsy()
//     })

//     it('should show SkeletonLoading when loading is true', async () => {
//       const wrapper = createComponent()
//       const { loading } = useTipEvents()
//       loading.value = true
//       await wrapper.vm.$nextTick()
//       expect(wrapper.findComponent(SkeletonLoading).exists()).toBeTruthy()
//     })

//     it('should not show table when loading is true', async () => {
//       const wrapper = createComponent()
//       const { loading } = useTipEvents()
//       loading.value = true
//       await wrapper.vm.$nextTick()
//       expect(wrapper.find('[data-test="table-tip-withdrawal-transactions"]').exists()).toBeFalsy()
//     })

//     it('should show table data when events are not empty', async () => {
//       const wrapper = createComponent()
//       const { events, loading } = useTipEvents()
//       loading.value = false
//       events.value = [
//         {
//           txHash: '0x1',
//           data: ['0xDepositor1', '1000000000000000000'] as Result,
//           date: '01/01/2022 00:00'
//         }
//       ]
//       await wrapper.vm.$nextTick()
//       expect(wrapper.find('tbody').exists()).toBeTruthy()
//       expect(wrapper.find('tbody').findAll('tr')).toHaveLength(1)
//     })

//     it('should show data in the correct format', async () => {
//       const wrapper = createComponent()
//       const { events, loading } = useTipEvents()
//       loading.value = false
//       events.value = [
//         {
//           txHash: '0x1',
//           data: ['0xDepositor1', '2000000000000000000'] as Result,
//           date: '01/01/2022 00:00'
//         }
//       ]
//       await wrapper.vm.$nextTick()
//       expect(wrapper.find('tbody').findAll('tr')).toHaveLength(1)
//       expect(wrapper.findAll('td')[0].text()).toBe('1')
//       expect(wrapper.findAll('td')[1].text()).toBe('0xDepositor1')
//       expect(wrapper.findAll('td')[2].text()).toBe(`2.0 ${NETWORK.currencySymbol}`)
//       expect(wrapper.findAll('td')[3].text()).toBe('01/01/2022 00:00')
//     })

//     it('should show no tip withdrawal transactions when events are empty', async () => {
//       const wrapper = createComponent()
//       const { events, loading } = useTipEvents()
//       loading.value = false
//       events.value = []
//       await wrapper.vm.$nextTick()
//       expect(wrapper.find('tbody').findAll('tr')).toHaveLength(1)
//       expect(wrapper.findAll('td')[0].text()).toBe('No TipWithdrawal Transactions')
//     })
//   })

//   describe('Events', () => {
//     it('should get events when mounted', () => {
//       createComponent()
//       const { getEvents } = useTipEvents()
//       getEvents()
//       expect(getEvents).toHaveBeenCalled()
//     })

//     it('should open transaction detail when click on a transaction', async () => {
//       const wrapper = createComponent()
//       const { events, loading } = useTipEvents()
//       loading.value = false
//       events.value = [
//         {
//           txHash: '0x1',
//           data: ['0xDepositor1', '1000000000000000000'] as Result,
//           date: '01/01/2022 00:00'
//         }
//       ]
//       await wrapper.vm.$nextTick()
//       await wrapper.find('tbody').find('tr').trigger('click')
//       expect(mockWindowOpen).toHaveBeenCalledWith(`${NETWORK.blockExplorerUrl}/tx/0x1`, '_blank')
//     })

//     it('should show error toast when get events failed', async () => {
//       const wrapper = createComponent()
//       const { error } = useTipEvents()
//       const { addErrorToast } = useToastStore()
//       error.value = Error('Failed to get withdrawal tip events')

//       await wrapper.vm.$nextTick()
//       expect(addErrorToast).toHaveBeenCalledWith('Failed to get withdrawal tip events')
//     })
//   })
// })
