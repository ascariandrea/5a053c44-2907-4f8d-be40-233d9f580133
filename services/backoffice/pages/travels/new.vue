<template>
  <CreateTravelForm />
</template>

<script lang="ts">
definePageMeta({
  middleware: ['is-authenticated'],
})
export default {
  setup() {
    const onSubmit = () => {}
    return { onSubmit }
  },
}
</script>
