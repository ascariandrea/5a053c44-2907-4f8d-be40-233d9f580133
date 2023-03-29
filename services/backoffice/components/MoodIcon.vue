<template>
  <span
    :style="`${height}px`"
    class="transititext-primary text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
    data-te-toggle="tooltip"
    :title="mood"
  >
    <SunIcon
      v-if="mood === 'nature'"
      :style="`height: ${height}px`"
      class="text-green-500"
    />
    <GlobeAltIcon
      v-if="mood === 'history'"
      :style="`height: ${height}px`"
      class="text-blue-300"
    />
    <BuildingLibraryIcon
      v-if="mood === 'culture'"
      :style="`height: ${height}px`"
      class="text-orange-400"
    />
    <UserGroupIcon
      v-if="mood === 'party'"
      :style="`height: ${height}px`"
      class="text-red-600"
    />
    <BookOpenIcon
      v-if="mood === 'relax'"
      :style="`height: ${height}px`"
      class="text-yellow-500"
    />
  </span>
</template>

<script lang="ts">
import {
  SunIcon,
  GlobeAltIcon,
  UserGroupIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
} from '@heroicons/vue/24/outline'

export default {
  components: {
    SunIcon,
    GlobeAltIcon,
    UserGroupIcon,
    BookOpenIcon,
    BuildingLibraryIcon,
  },
  props: {
    mood: { type: String, required: true },
    height: { type: Number, default: 24 },
  },
}
</script>
