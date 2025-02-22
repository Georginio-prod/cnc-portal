<template>
  <h1 class="font-bold text-2xl mb-5">Set Max Limit</h1>
  <hr />
  <div class="mt-5">
    <div v-if="isBodAction">
      <p data-test="bod-notification" class="pt-2 text-red-500">
        This will create a board of directors action
      </p>
      <label class="input input-bordered flex items-center gap-2 input-md mt-2">
        <span class="w-24">Description</span>
        <input
          type="text"
          class="grow"
          data-test="description-input"
          v-model="description"
          placeholder="Enter an action description..."
        />
      </label>

      <div
        class="pl-4 text-red-500 text-sm w-full text-left"
        v-for="error of v$.description.$errors"
        :key="error.$uid"
      >
        {{ error.$message }}
      </div>
    </div>
    <label class="input input-bordered flex items-center gap-2 input-md mt-2">
      <span class="w-24">Amount</span>
      <input type="text" class="grow" v-model="amount" placeholder="Enter an mount..." />
    </label>

    <div
      class="pl-4 text-red-500 text-sm w-full text-left"
      v-for="error of v$.amount.$errors"
      :key="error.$uid"
    >
      {{ error.$message }}
    </div>

    <div class="modal-action justify-center">
      <LoadingButton color="primary" class="w-24" v-if="loading" />
      <button
        class="btn btn-primary"
        @click="submitForm"
        v-if="!loading"
        data-test="transferButton"
      >
        Set Limit
      </button>
      <button class="btn btn-error" @click="$emit('closeModal')">Cancel</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import LoadingButton from '@/components/LoadingButton.vue'
import { required, numeric, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const emit = defineEmits(['setLimit', 'closeModal'])
const props = defineProps<{ loading: boolean; isBodAction: boolean }>()
const amount = ref('0')
const description = ref('')
const notZero = helpers.withMessage('Amount must be greater than 0', (value: string) => {
  return parseFloat(value) > 0
})

const rules = {
  description: {
    required: helpers.withMessage('Description is required', (value: string) => {
      return props.isBodAction ? value.length > 0 : true
    })
  },
  amount: {
    numeric,
    required,
    notZero
  }
}

const v$ = useVuelidate(rules, { description, amount })

const submitForm = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) {
    return
  }
  emit('setLimit', amount.value, description.value)
}

watch(
  () => props.loading,
  (newVal) => {
    if (newVal) return
    emit('closeModal')
  }
)
</script>
