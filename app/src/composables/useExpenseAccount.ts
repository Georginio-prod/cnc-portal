import { ExpenseAccountService } from '@/services/expenseAccountService'
import { ref } from 'vue'
import { log, parseError } from "@/utils";

const expenseAccountService = new ExpenseAccountService()

export function useExpenseAccountIsApprovedAddress() {
  const data = ref<boolean>(false)
  const loading = ref(false)
  const error = ref<any>(null)
  const isSuccess = ref(false)

  async function isApprovedAddress(
    expenseAccountAddress: string,
    userAddress: string
  ) {
    try {
      loading.value = true
      data.value = await expenseAccountService.isApprovedAddress(
        expenseAccountAddress,
        userAddress
      )
      isSuccess.value = true
    } catch (err) {
      log.error(parseError(err))
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { execute: isApprovedAddress, isLoading: loading, isSuccess, error, data }
}

export function useDeployExpenseAccountContract() {
  const data = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<any>(null)
  const isSuccess = ref(false)

  async function deploy() {
    try {
      loading.value = true
      data.value = await expenseAccountService.createExpenseAccountContract()
      isSuccess.value = true
    } catch (err) {
      log.error(parseError(err))
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { execute: deploy, isLoading: loading, isSuccess, error, data }
}

export function useExpenseAccountGetOwner() {
  const data = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<any>(null)
  const isSuccess = ref(false)

  async function getOwner(address: string) {
    try {
      loading.value = true
      data.value = await expenseAccountService.getOwner(address)
      isSuccess.value = true
    } catch (err) {
      log.error(parseError(err))
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { execute: getOwner, isLoading: loading, isSuccess, error, data }
}

export function useExpenseAccountGetBalance() {
  const data = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<any>(null)
  const isSuccess = ref(false)

  async function getBalance(address: string) {
    try {
      loading.value = true
      data.value = await expenseAccountService.getBalance(address)
      isSuccess.value = true
    } catch (err) {
      log.error(parseError(err))
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { execute: getBalance, isLoading: loading, isSuccess, error, data }
}