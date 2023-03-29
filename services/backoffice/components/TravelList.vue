<template>
  <div>
    <ul>
      <div v-if="travels?.travels.length === 0">
        <NuxtLink to="/travels/new"> Create a travel </NuxtLink>
      </div>
      <li v-for="travel in travels?.travels" :key="travel.id" class="py-4">
        <div class="grid grid-cols-10 items-top gap-6">
          <div class="text-sm col-span-4 flex-grow font-medium text-gray-900">
            <p>
              {{ travel.name }}
            </p>
            <p class="text-sm text-gray-500">{{ travel.description }}</p>
          </div>
          <div class="col-span-2" style="text-align: right">
            <p>
              {{ travel.numberOfDays
              }}<span class="text-sm text-gray-500">gg</span>
            </p>
          </div>
          <div class="col-span-1">
            <p
              v-for="[moodKey, mood] in Object.entries(travel.moods)"
              :key="moodKey"
              class="flex grid grid-cols-12 items-center justify-center gap-2"
            >
              <span class="flex col-span-6 items-center justify-center">
                <MoodIcon :mood="moodKey" />
              </span>
              <span class="flex col-span-6 items-center justify-center">
                {{ mood }}
              </span>
            </p>
          </div>
          <div class="col-span-1">
            <div>
              <NuxtLink
                class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                :to="`/travels/${travel.slug}${user ? '' : '/moods'}`"
                >{{ user ? 'Edit' : 'View' }}</NuxtLink
              >
            </div>
          </div>
        </div>
      </li>
    </ul>
    <PageNavigation
      :page="page"
      :on-page-change="onPageChange"
      :total="travels?.total"
    />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import MoodIcon from './MoodIcon.vue'
import PageNavigation from './PageNavigation.vue'
import { useTravels } from '~~/composables/useTravels'
import { useUser } from '~/composables/useUser'

export default {
  components: { MoodIcon, PageNavigation },
  async setup() {
    const page = ref(1)
    const skip = ref(0)
    const take = ref(20)
    const { data: user } = await useUser()
    const travels = await useTravels({ skip, take })

    return {
      page,
      skip,
      take,
      user,
      travels,
    }
  },
  methods: {
    onPageChange(page: number) {
      if (page > 0) {
        this.page = page
        this.skip = (page - 1) * this.take
      } else {
        this.page = page
        this.skip = 0
      }
    },
  },
}
</script>
