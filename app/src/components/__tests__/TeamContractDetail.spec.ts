import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TeamContractsDetail from '@/components/TeamContractsDetail.vue'

describe('TeamContractsDetail.vue', () => {
  const testData = [
    { key: 'costPerClick', value: '10 MATIC' },
    { key: 'costPerImpression', value: '5 MATIC' }
  ]

  it('renders table headers correctly', () => {
    const wrapper = mount(TeamContractsDetail, {
      props: {
        datas: testData
      }
    })

    // Check that table headers exist and are correct
    const headers = wrapper.findAll('th')
    expect(headers[0].text()).toBe('#')
    expect(headers[1].text()).toBe('Name')
    expect(headers[2].text()).toBe('Value')
  })

  it('renders table rows based on props', () => {
    const wrapper = mount(TeamContractsDetail, {
      props: {
        datas: testData
      }
    })

    // Ensure that the number of rows matches the testData length
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(testData.length)

    // Check first row values
    expect(rows[0].find('th').text()).toBe('1') // Index
    expect(rows[0].findAll('td')[0].text()).toBe('costPerClick') // Name
    expect(rows[0].findAll('td')[1].text()).toBe('10 MATIC') // Value

    // Check second row values
    expect(rows[1].find('th').text()).toBe('2') // Index
    expect(rows[1].findAll('td')[0].text()).toBe('costPerImpression') // Name
    expect(rows[1].findAll('td')[1].text()).toBe('5 MATIC') // Value
  })

  it('renders table rows correctly when no data is passed', () => {
    const wrapper = mount(TeamContractsDetail, {
      props: {
        datas: []
      }
    })

    // Ensure that no rows are rendered
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(0)
  })

  it('renders table rows correctly when data is null', () => {
    const wrapper = mount(TeamContractsDetail, {
      props: {
        datas: null as unknown as { key: string; value: string }[]
      }
    })

    // Ensure that no rows are rendered
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(0)
  })
})
