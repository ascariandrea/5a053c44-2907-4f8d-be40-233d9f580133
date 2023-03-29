<template>
  <div>
    <h4 class="text-base font-semibold text-gray-900">Create Tour</h4>
    <form @submit.prevent="onSubmit">
      <div class="sm:col-span-4 mb-4">
        <label
          for="slug"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Name</label
        >
        <div class="mt-2">
          <div
            class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
          >
            <input
              id="name"
              v-model="form.name"
              type="text"
              name="name"
              autocomplete="name"
              class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Summer in India"
            />
          </div>
        </div>
      </div>
      <div class="sm:col-span-4 mb-4">
        <label
          for="name"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Price</label
        >
        <div class="mt-2">
          <div
            class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
          >
            <input
              id="price"
              type="number"
              name="price"
              :value="form.price / 100"
              autocomplete="price"
              class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Trip to India"
              @input="onPriceChange"
            />
          </div>
        </div>
      </div>
      <div class="sm:col-span-4 mb-4">
        <label
          for="name"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Price</label
        >
        <div class="mt-2">
          <div
            class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
          >
            <input
              id="startingDate"
              type="date"
              name="startingDate"
              :value="form.startingDate"
              autocomplete="01/01/2024"
              class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Trip to India"
              @input="onStartingDateChange"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Add tour
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { parse } from 'date-fns'
import { Tour } from '@weroad-test/models/lib'
import { useCreateTour } from '~/composables/useCreateTour'

export default {
  props: {
    name: { type: String, default: '' },
    price: { type: Number, default: 80000 },
    startingDate: { type: Date, default: new Date() },
    travelId: { type: String, required: true },
    onTourCreate: { type: Function, default: (_c: Tour.Tour) => undefined },
  },
  data() {
    return {
      form: {
        name: this.name,
        price: this.price,
        startingDate: this.startingDate.toLocaleDateString(),
      },
    }
  },
  methods: {
    onPriceChange($event: any) {
      this.$data.form.price = $event.target.value * 100
    },
    onStartingDateChange($event: any) {
      this.$data.form.startingDate = $event.target.value
    },
    async onSubmit() {
      const tour = await useCreateTour({
        ...this.$data.form,
        startingDate: parse(
          this.$data.form.startingDate,
          'yyyy-MM-dd',
          new Date()
        ),
        travelId: this.travelId as any,
      })
      this.onTourCreate(tour)
      this.$data.form.name = ''
      this.$data.form.startingDate = ''
      this.$data.form.price = 80000
    },
  },
}
</script>
