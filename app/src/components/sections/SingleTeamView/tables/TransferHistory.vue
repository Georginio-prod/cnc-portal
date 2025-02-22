<template>
  <div id="transfer">
    <SkeletonLoading v-if="loading" class="w-full h-96 mt-5" />
    <div v-if="!loading" data-test="table" class="overflow-x-auto bg-base-100 mt-5">
      <table class="table table-zebra text-center">
        <!-- head -->
        <thead>
          <tr data-test="table-head-row" class="font-bold text-lg">
            <th>No</th>
            <th>Sender</th>
            <th>To</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody data-test="data-exists" v-if="(events?.length ?? 0) > 0">
          <tr
            v-for="(event, index) in events"
            data-test="table-body-row"
            v-bind:key="event.transactionHash"
            class="cursor-pointer hover"
            @click="showTxDetail(event.transactionHash)"
          >
            <td data-test="data-row-number">{{ index + 1 }}</td>
            <td data-test="data-row-sender" class="truncate max-w-48">{{ event.args.sender }}</td>
            <td data-test="data-row-to" class="truncate max-w-48">{{ event.args.to }}</td>
            <td data-test="data-row-amount">
              {{ formatEther(event.args.amount!) }} {{ NETWORK.currencySymbol }}
            </td>
            <td data-test="data-row-date">{{ dates[index] }}</td>
          </tr>
        </tbody>
        <tbody data-test="data-empty" v-else>
          <tr>
            <td class="text-center font-bold text-lg" colspan="5">No transfer transactions</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonLoading from '@/components/SkeletonLoading.vue'
import { NETWORK } from '@/constant'
import { useToastStore } from '@/stores/useToastStore'
import { onMounted, watch } from 'vue'
import { ref } from 'vue'
import { formatEther, parseAbiItem, type Address, type GetLogsReturnType } from 'viem'
import { getBlock, getLogs } from 'viem/actions'
import { config } from '@/wagmi.config'

const client = config.getClient()
const { addErrorToast } = useToastStore()
const props = defineProps<{
  bankAddress: string
}>()
const loading = ref(false)
const error = ref<unknown | null>(null)
const events = ref<
  GetLogsReturnType<{
    readonly name: 'Transfer'
    readonly type: 'event'
    readonly inputs: readonly [
      {
        readonly type: 'address'
        readonly name: 'sender'
        readonly indexed: true
      },
      {
        readonly type: 'address'
        readonly name: 'to'
        readonly indexed: true
      },
      {
        readonly type: 'uint256'
        readonly name: 'amount'
      }
    ]
  }>
>([])
const dates = ref<string[]>([])

onMounted(async () => {
  loading.value = true
  try {
    events.value = await getLogs(client, {
      address: props.bankAddress as Address,
      event: parseAbiItem(
        'event Transfer(address indexed sender, address indexed to, uint256 amount)'
      ),
      fromBlock: 'earliest',
      toBlock: 'latest'
    })
    dates.value = await Promise.all(
      events.value.map(async (event) => {
        const block = await getBlock(client, {
          blockHash: event.blockHash
        })
        return new Date(parseInt(block.timestamp.toString()) * 1000).toLocaleString()
      })
    )
  } catch (e) {
    error.value = e
  }
  loading.value = false
})

const showTxDetail = (txHash: string) => {
  window.open(`${NETWORK.blockExplorerUrl}/tx/${txHash}`, '_blank')
}

watch(error, () => {
  if (error.value) {
    addErrorToast('Failed to get transfer events')
  }
})
</script>
