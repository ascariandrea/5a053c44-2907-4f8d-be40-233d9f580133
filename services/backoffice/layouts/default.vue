import ErrorSnackBar from '~/components/ErrorSnackBar.vue';

<template>
  <div class="w-full">
    <div class="flex w-full flex-col">
      <AppHeader />
      <div class="container mx-auto max-w-6xl px-2 py-6 sm:px-6 lg:px-8 flex">
        <slot />
      </div>
      <ErrorSnackBar />
    </div>
  </div>
</template>
