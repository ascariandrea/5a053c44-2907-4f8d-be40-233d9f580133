<template>
  <div>
    <div>Travel {{ travel.name }}</div>
    <div class="space-y-12">
      <div class="mt-6 py-4 bg-white z-50">
        <div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <a
                v-if="user !== null"
                :key="tabs[0].name"
                :href="tabs[0].href"
                :class="[
                  tabs[0].name === tab
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium capitalize',
                ]"
                :aria-current="tabs[0].name === tab ? 'page' : undefined"
                @click.prevent="() => (tab = tabs[0].name)"
              >
                {{ tabs[0].name }}
              </a>

              <a
                :key="tabs[1].name"
                :href="tabs[1].href"
                :class="[
                  tabs[1].name === tab
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium capitalize',
                ]"
                :aria-current="tabs[1].name === tab ? 'page' : undefined"
                @click.prevent="() => (tab = tabs[1].name)"
              >
                {{ tabs[1].name }} ({{ tours?.total }})
              </a>
            </div>
          </div>
        </div>
        <div
          class="grid grid-cols-12 border-b border-gray-900/10 pb-12 gap-x-6"
        >
          <div class="col-span-9">
            <TravelForm
              v-if="tab === 'travel' && user !== null"
              v-bind="travel"
              :user-id="travel?.creator?.id"
              :on-submit="onSubmit"
              :select-creator="userCanEdit"
              :editable="userCanEdit"
            />
            <TourGrid
              v-if="tab === 'tours'"
              :travel-id="travel?.id"
              :total="tours?.total ?? 0"
            />
          </div>
          <div class="col-span-3">
            <TourForm
              v-if="user !== null"
              :travel-id="travel.id"
              @tour-create="onTourCreate"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute } from 'nuxt/app'
import { ref } from 'vue'
import TourForm from '~/components/TourForm.vue'
import TourGrid from '~/components/TourGrid.vue'
import { useTours } from '~/composables/useTours'
import { useUser } from '~/composables/useUser'
import TravelForm from '~~/components/TravelForm.vue'
import { useEditTravel } from '~~/composables/useEditTravel'
import { useTravelBySlug } from '~~/composables/useTravelBySlug'

definePageMeta({
  middleware: 'is-authenticated',
})

export default {
  components: { TravelForm, TourForm, TourGrid },
  async setup() {
    const route = useRoute()
    const { slug } = route.params

    const skip = ref(0)
    const take = ref(20)

    const { data: user } = await useUser()

    const travel = await useTravelBySlug(slug as any)

    const { data: tours, refresh } = await useTours({
      travelId: ref(travel.value?.id),
      skip,
      take,
    })

    const tabs = [
      {
        name: 'travel',
        href: '',
      },
      {
        name: 'tours',
        href: '#tours',
      },
    ]

    const tab = ref(user.value ? tabs[0].name : tabs[1].name)

    return { user, take, travel, tours, refreshTours: refresh, tab, tabs }
  },
  computed: {
    userCanEdit() {
      const canEdit = this.user?.permissions.some((p: any) => {
        return ['travel:*', 'travel:del'].includes(p)
      })
      return canEdit
    },
  },
  methods: {
    async onSubmit(travelData: any) {
      const updatedTravel = await useEditTravel(this.travel.id, travelData)
      this.travel = updatedTravel.value
      this.$router.push(`/travels/${this.travel.slug}/`)
    },
    onTourCreate() {
      this.refreshTours()
    },
    onTourDelete() {
      this.refreshTours()
    },
    onTabChange(v: any) {
      this.tab = v
    },
  },
}
</script>
