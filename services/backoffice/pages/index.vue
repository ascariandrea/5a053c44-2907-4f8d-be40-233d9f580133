<template>
  <div>
    <div class="fixed sticky top-0 mt-6 py-4 bg-white z-50">
      <div
        v-if="userCanCreate"
        class="grid grid-cols-12 border-b border-gray-900/10 pb-12"
      >
        <div class="col-span-9">
          <h2 class="text-base font-semibold text-gray-900">Travels</h2>
          <p class="mt-1 text-sm text-gray-600">
            Travel list page, ordered by DESC <code>updatedAt</code>. Click the
            button on the right to add a new travel.
          </p>
        </div>
        <div class="col-span-3 flex gap-x-6">
          <div>
            <NuxtLink
              href="/travels/new"
              class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h2>Travel List</h2>
      <div
        v-if="user === null"
        class="grid grid-cols-12 border-b border-gray-900/10 pb-12"
      >
        <div class="col-span-9">
          <h2 class="text-base font-semibold text-gray-900">Travels</h2>
          <p class="mt-1 text-sm text-gray-600">
            Travel list page, ordered by DESC <code>updatedAt</code>. Click the
            button on the right to add a new travel.
          </p>
        </div>
      </div>
      <TravelList />
    </div>
  </div>
</template>

<script lang="ts">
import { useUser } from '~/composables/useUser'

export default {
  async setup() {
    const { data: user } = await useUser()
    return {
      user,
    }
  },
  computed: {
    userCanCreate() {
      const canEdit = this.user?.permissions.some((p: any) => {
        return ['travel:*', 'travel:write', 'travel:delete'].includes(p)
      })
      return canEdit
    },
  },
}
</script>
