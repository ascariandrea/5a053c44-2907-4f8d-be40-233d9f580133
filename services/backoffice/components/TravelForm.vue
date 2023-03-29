<template>
  <form id="create-travel-form" @submit.prevent="handleSubmit">
    <div class="space-y-12">
      <div v-if="editable" class="fixed sticky top-0 mt-6 py-4 bg-white z-50">
        <div class="grid grid-cols-12 border-b border-gray-900/10 pb-12">
          <div class="col-span-9">
            <h2 class="text-base font-semibold text-gray-900">Travel</h2>
            <p class="mt-1 text-sm text-gray-600">
              Hit the save button when you made some changes to the travel.
            </p>
          </div>
          <div class="col-span-3 flex gap-x-6">
            <button
              type="button"
              class="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div class="border-b border-gray-900/10 pb-12">
        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label
              for="name"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Name</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  id="name"
                  type="text"
                  name="name"
                  :value="form.name"
                  :disabled="!editable"
                  autocomplete="name"
                  class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Trip to India"
                  @input="onNameChange"
                />
              </div>
            </div>
          </div>

          <div class="sm:col-span-4">
            <label
              for="slug"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Slug</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <span
                  class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"
                  >weroad.com/travels/</span
                >
                <input
                  id="slug"
                  v-model="form.slug"
                  :disabled="!editable"
                  type="text"
                  name="slug"
                  autocomplete="slug"
                  class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="trip-to-india"
                />
              </div>
            </div>
          </div>

          <div class="col-span-full">
            <label
              for="description"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Description</label
            >
            <div class="mt-2">
              <textarea
                id="description"
                v-model="form.description"
                name="description"
                :disabled="!editable"
                rows="3"
                class="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
              ></textarea>
            </div>
            <p class="mt-3 text-sm leading-6 text-gray-600">
              Write a few sentences describing the trip.
            </p>
          </div>

          <div class="col-span-full">
            <label
              for="numberOfDays"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Number of Days</label
            >
            <div class="mt-2">
              <input
                id="numberOfDays"
                v-model="form.numberOfDays"
                name="numberOfDays"
                :disabled="!editable"
                rows="3"
                type="number"
                class="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
              />
            </div>
            <p class="mt-3 text-sm leading-6 text-gray-600">
              Include in the count both arrival and departure days.
            </p>
          </div>

          <div class="col-span-full">
            <label
              for="cover-photo"
              class="block text-sm font-medium leading-6 text-gray-900 pb-4"
              >Moods</label
            >
            <div class="border border-solid border-gray-900/10 rounded">
              <div
                v-for="[moodKey, mood] in Object.entries(form.moods)"
                :key="moodKey"
                class="mt-2 grid grid-cols-12 gap-4 items-center rounded-lg px-4 py-4"
              >
                <span class="col-span-2 capitalize"
                  >{{ moodKey }} ({{ mood }})</span
                >
                <input
                  :id="'mood-{{ moodKey }}'"
                  :value="(form.moods as any)[moodKey]"
                  type="range"
                  min="1"
                  max="10"
                  :disabled="!editable"
                  class="col-span-10 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  @change="$event => onMoodChange(moodKey as any)($event)"
                />
              </div>
            </div>
          </div>

          <div v-if="selectCreator" class="col-span-full">
            <label
              for="creator"
              class="block text-sm font-medium leading-6 text-gray-900 pb-4"
              >Creator</label
            >
            <select name="userId" :v-model="form.userId" @change="onUserChange">
              <option
                v-for="u in users"
                :key="u.id"
                :value="u.id"
                :selected="u.id === form.userId"
              >
                {{ u.username }} ({{ u.permissions.join(',') }})
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import kebabCase from 'lodash/kebabCase'
import { useUsers } from '~~/composables/useUsers'

export default {
  props: {
    name: { type: String, default: '' },
    slug: { type: String, default: '' },
    description: { type: String, default: '' },
    numberOfDays: { type: Number, default: 10 },
    moods: {
      type: Object,
      default: (m: any) => ({
        nature: 10,
        party: 10,
        history: 10,
        culture: 10,
        relax: 10,
        ...m.moods,
      }),
    },
    userId: { type: String, required: true },
    onSubmit: { type: Function, required: true },
    editable: { type: Boolean, default: true },
    selectCreator: { type: Boolean, default: true },
  },
  async setup() {
    const users = await useUsers({})

    return {
      users,
    }
  },
  data() {
    return {
      form: {
        slug: this.slug,
        name: this.name,
        description: this.description,
        numberOfDays: this.numberOfDays,
        moods: {
          nature: 10,
          party: 10,
          history: 10,
          culture: 10,
          relax: 10,
          ...this.moods,
        },
        userId: this.userId,
      },
    }
  },
  methods: {
    onMoodChange(moodKey: string) {
      return (event: any) => {
        ;(this.$data.form.moods as any)[moodKey] = parseInt(
          event.target.value,
          10
        )
      }
    },
    onNameChange(event: any) {
      this.$data.form.name = event.target.value
      this.$data.form.slug = kebabCase(event.target.value)
    },
    onUserChange(event: any) {
      this.$data.form.userId = event.target.value
    },
    handleSubmit() {
      this.onSubmit({ ...this.$data.form })
    },
  },
}
</script>
