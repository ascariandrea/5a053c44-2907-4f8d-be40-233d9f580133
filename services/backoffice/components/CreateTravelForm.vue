<template>
  <TravelForm
    v-if="user !== null"
    :on-submit="onSubmit"
    :select-creator="false"
    :creator="user"
  />
</template>

<script lang="ts">
import { CreateTravelBody } from '@weroad-test/models/lib/Travel'
import TravelForm from './TravelForm.vue'
import { useCreateTravel } from '~~/composables/useCreateTravel'
import { useUser } from '~/composables/useUser'

export default {
  components: { TravelForm },
  async setup() {
    const user = await useUser()
    return {
      user,
    }
  },
  data() {
    return {
      name: '',
      slug: '',
      description: '',
      numberOfDays: 14,
      moods: {
        nature: 10,
        party: 10,
        history: 10,
        culture: 10,
        relax: 10,
      },
    }
  },
  methods: {
    async onSubmit({
      userId: _userId,
      ...travelData
    }: CreateTravelBody & { userId: string }) {
      const travel = await useCreateTravel(travelData)

      this.$router.push(`/travels/${travel.value.slug}`)
    },
  },
}
</script>
