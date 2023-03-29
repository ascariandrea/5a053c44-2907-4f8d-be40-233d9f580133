<template>
  <div class="my-12 px-20" style="width: 100%">
    <form class="flex flex-col" @submit.prevent="onSubmit">
      <div class="mb-4">
        <div
          class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
        >
          <input
            id="username"
            v-model="username"
            name="username"
            type="text"
            placeholder="username"
            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div
        class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md mb-4"
      >
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          placeholder="password"
          class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
        />
      </div>
      <button
        type="submit"
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useDoLogin } from '~~/composables/useDoLogin'

export default {
  setup() {
    const token = useAuth()
    return { token }
  },
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    async onSubmit() {
      const token = await useDoLogin(this.$data.username, this.$data.password)
      if (token.value) {
        this.token = token.value
        this.$router.push('/')
      }
    },
  },
}
</script>
