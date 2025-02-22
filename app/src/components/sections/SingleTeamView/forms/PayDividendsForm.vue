<template>
  <div class="flex flex-col gap-4">
    <h2>Pay Dividends to the shareholders</h2>

    <h3>
      Please input amount of {{ NETWORK.currencySymbol }} to divide to the shareholders. This will
      move funds from bank contract to the shareholders
    </h3>

    <h6>
      Current Bank contract balance <span v-if="balanceLoading">...</span>
      <span v-else> {{ formatEther(bankBalance?.value!) }}</span>
      {{ NETWORK.currencySymbol }}
    </h6>
    <label class="input input-bordered flex items-center gap-2 input-md mt-2 w-full">
      <p>Amount</p>
      |
      <input type="number" class="grow" data-test="amount-input" v-model="amount" />
      {{ NETWORK.currencySymbol }}
    </label>
    <div
      class="pl-4 text-red-500 text-sm w-full text-left"
      v-for="error of $v.amount.$errors"
      :key="error.$uid"
    >
      {{ error.$message }}
    </div>

    <div class="text-center">
      <LoadingButton v-if="loading" class="w-44" color="primary" />
      <button v-if="!loading" class="btn btn-primary w-44 text-center" @click="onSubmit()">
        Mint
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingButton from '@/components/LoadingButton.vue'
import { NETWORK } from '@/constant'
import { useToastStore } from '@/stores'
import type { Team } from '@/types'
import useVuelidate from '@vuelidate/core'
import { numeric, required } from '@vuelidate/validators'
import { useBalance } from '@wagmi/vue'
import { formatEther, parseEther, type Address } from 'viem'
import { onMounted, watch } from 'vue'
import { ref } from 'vue'

const amount = ref<number | null>(null)
const { addErrorToast } = useToastStore()

const props = defineProps<{
  tokenSymbol: string | undefined
  loading: boolean
  team: Team
}>()

const {
  data: bankBalance,
  isLoading: balanceLoading,
  error: balanceError,
  refetch: fetchBalance
} = useBalance({
  address: props.team.bankAddress as Address
})

const emits = defineEmits(['submit'])

const rules = {
  amount: {
    required,
    numeric
  }
}

const onSubmit = () => {
  $v.value.$touch()
  if ($v.value.$invalid) return

  emits('submit', parseEther((amount.value ?? 0).toString()))
}

const $v = useVuelidate(rules, { amount })

watch(balanceError, () => {
  if (balanceError.value) {
    addErrorToast('Failed to fetch team balance')
  }
})
onMounted(() => {
  fetchBalance()
})
</script>
