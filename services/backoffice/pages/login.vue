<template>
  <div style="width: 100%">
    <div class="grid grid-cols-12">
      <div class="col-start-4 col-end-10 flex justify-center">
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: 'is-authenticated',
})
</script>
