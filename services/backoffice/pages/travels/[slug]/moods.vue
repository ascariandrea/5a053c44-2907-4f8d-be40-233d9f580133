<template>
  <TourGrid :travel-id="travel.id" />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import TourGrid from '~/components/TourGrid.vue'
import { useTravelBySlug } from '~/composables/useTravelBySlug'

const { params } = useRoute()
const travel = await useTravelBySlug(params.slug as string)
</script>
