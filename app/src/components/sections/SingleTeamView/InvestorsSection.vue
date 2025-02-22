<template>
  <div class="flex flex-col gap-y-8">
    <InvestorsHeader
      :token-symbol="tokenSymbol"
      :total-supply="totalSupply"
      :team="team"
      :token-symbol-loading="tokenSymbolLoading"
      :total-supply-loading="totalSupplyLoading"
      :token-balance="tokenBalance"
      :loading-token-balance="loadingTokenBalance"
    />
    <div class="divider m-0"></div>
    <InvestorsActions
      :token-symbol-loading="tokenSymbolLoading"
      :token-symbol="tokenSymbol"
      :team="team"
      @refetchShareholders="
        () => {
          refetchTokenBalance()
          refetchShareholders()
          refetchTotalSupply()
        }
      "
      :shareholders="shareholders"
    />
    <div class="divider m-0"></div>
    <ShareholderList
      :team="team"
      :token-symbol="tokenSymbol"
      :token-symbol-loading="tokenSymbolLoading"
      :shareholders="shareholders"
      :loading="shareholderLoading"
      :total-supply="totalSupply"
      :total-supply-loading="totalSupplyLoading"
      @refetchShareholders="
        () => {
          refetchTokenBalance()
          refetchShareholders()
          refetchTotalSupply()
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import InvestorsHeader from '@/components/sections/SingleTeamView/InvestorsHeader.vue'
import InvestorsActions from '@/components/sections/SingleTeamView/InvestorsActions.vue'
import { useReadContract } from '@wagmi/vue'
import { type Address } from 'viem'
import { INVESTOR_ABI } from '@/artifacts/abi/investorsV1'
import ShareholderList from '@/components/sections/SingleTeamView/ShareholderList.vue'
import { watch } from 'vue'
import { log } from '@/utils'
import { useToastStore, useUserDataStore } from '@/stores'
import type { Team } from '@/types'

const { addErrorToast } = useToastStore()
const { address: currentAddress } = useUserDataStore()

const props = defineProps<{
  team: Team
}>()

const {
  data: totalSupply,
  isLoading: totalSupplyLoading,
  error: totalSupplyError,
  refetch: refetchTotalSupply
} = useReadContract({
  abi: INVESTOR_ABI,
  address: props.team.investorsAddress as Address,
  functionName: 'totalSupply'
})

const {
  data: tokenSymbol,
  isLoading: tokenSymbolLoading,
  error: tokenSymbolError
} = useReadContract({
  abi: INVESTOR_ABI,
  address: props.team.investorsAddress as Address,
  functionName: 'symbol'
})

const {
  data: shareholders,
  isLoading: shareholderLoading,
  error: shareholderError,
  refetch: refetchShareholders
} = useReadContract({
  abi: INVESTOR_ABI,
  address: props.team.investorsAddress as Address,
  functionName: 'getShareholders'
})

const {
  data: tokenBalance,
  error: tokenBalanceError,
  isLoading: loadingTokenBalance,
  refetch: refetchTokenBalance
} = useReadContract({
  abi: INVESTOR_ABI,
  address: props.team.investorsAddress as Address,
  functionName: 'balanceOf',
  args: [currentAddress as Address]
})

watch(tokenBalanceError, () => {
  if (tokenBalanceError.value) {
    log.error('Failed to fetch token balance')
    addErrorToast('Failed to fetch token balance')
  }
})

watch(totalSupplyError, (value) => {
  if (value) {
    log.error('Error fetching total supply', value)
    addErrorToast('Error fetching total supply')
  }
})
watch(tokenSymbolError, (value) => {
  if (value) {
    log.error('Error fetching token symbol', value)
    addErrorToast('Error fetching token symbol')
  }
})
watch(shareholderError, (value) => {
  if (value) {
    log.error('Error fetching shareholders', value)
    addErrorToast('Error fetching shareholders')
  }
})
</script>
