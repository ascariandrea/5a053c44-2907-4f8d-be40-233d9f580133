<template>
  <div class="fixed bottom-0 right-0 my-6 mr-6" style="width: 300px">
    <div
      v-for="err in errors?.gqlErrors ?? []"
      :key="err.path.join('-')"
      class="block px-4 py-4 bg-red-400"
    >
      <p class="font-semi-bold text-red-600 mb-6">
        {{ err.path.join('.') }}: {{ err.extensions.code }}
      </p>
      <p class="text-gray-600">{{ err.message }}</p>
      <div>
        <TrashIcon
          style="height: 24px"
          class="cursor-pointer"
          @click.prevent="() => onErrorDelete(err)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline'
import { useState } from 'nuxt/app'
import { computed } from 'vue'
import { isUserNotFound } from '~/plugins/on-error'

export default {
  components: { TrashIcon },
  setup() {
    const _errors = useState<{
      gqlErrors: Array<{
        message: string
        path: string[]
        extensions: { code: string }
      }>
    }>('_gqlErrors', () => ({ gqlErrors: [] }))

    const errors = computed(() =>
      (_errors.value?.gqlErrors ?? []).filter((e) => {
        return !isUserNotFound(e)
      })
    )
    return {
      errors,
    }
  },
  methods: {
    onErrorDelete(err: any) {
      this.errors.gqlErrors = this.errors.gqlErrors.filter(
        (e: any) => e.message !== err.message
      )
    },
  },
}
</script>
