<template>
  <div>Logout</div>
</template>
<script lang="ts">
import { useUser } from '~/composables/useUser'
import { useDoLogout } from '~~/composables/useDoLogout'

export default {
  async setup() {
    const { refresh } = await useUser()
    return { ...useDoLogout(), refreshUser: refresh }
  },
  async created() {
    await this.onLogout()
    this.refreshUser()
    this.$router.push('/login')
  },
}
</script>
