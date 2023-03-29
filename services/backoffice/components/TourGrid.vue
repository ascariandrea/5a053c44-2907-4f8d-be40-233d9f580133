<template>
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pt-4 pb-12 mt-10">
      <div class="mt-3 grid grid-cols-12 border-b border-gray-900/10 pb-12">
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
                :model="filter.name"
                :onchange="($event: any) => onFilterChange('name')($event)"
                autocomplete="name"
                class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Trip to India"
              />
            </div>
          </div>
        </div>
        <div class="sm:col-span-4 ml-4">
          <label
            for="starting_date"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Starting Date</label
          >
          <div class="mt-2">
            <div
              class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
            >
              <input
                id="starting_date"
                type="date"
                name="starting_date"
                :model="filter.startingDate"
                :onchange="($event: any) => onFilterChange('startingDate')($event)"
                :autocomplete="new Date().toLocaleDateString()"
                class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Trip to India"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3 grid grid-cols-12 border-b border-gray-900/10 pb-3">
        <div class="col-span-5">
          <p class="text-sm text-gray-600">Tour Name</p>
        </div>
        <div class="col-span-2">
          <p class="text-sm text-gray-600">Price</p>
        </div>
        <div class="col-span-2">
          <p class="text-sm text-gray-600">Starting Date</p>
        </div>
        <div class="col-span-2">
          <p class="text-sm text-gray-600">Ending Date</p>
        </div>
        <div class="col-span-1">
          <p class="text-sm text-gray-600">Actions</p>
        </div>
      </div>
      <div
        v-for="tour in tours?.tours ?? []"
        :key="tour.id"
        class="mt-3 grid grid-cols-12 border-b border-gray-900/10 pb-3"
      >
        <div class="col-span-5">{{ tour.name }}</div>
        <div class="col-span-2">{{ tour.price / 100 }} euro</div>
        <div class="col-span-2">
          {{ format(tour.startingDate, 'yyyy-MM-dd') }}
          <span class="block">
            (in {{ formatDistance(tour.startingDate, new Date()) }})
          </span>
        </div>
        <div class="col-span-2">
          {{ format(tour.endingDate, 'yyyy-MM-dd') }}
        </div>
        <div
          class="col-span-1 flex items-center justify-center"
          @click.prevent="() => onDelete(tour.id)"
        >
          <TrashIcon style="height: 24px" class="text-red-400 cursor-pointer" />
        </div>
      </div>
    </div>
    <div>
      <div
        class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
      >
        <div class="flex flex-1 justify-between sm:hidden">
          <a
            href="#"
            class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @on-click.prevent="() => onPageChange(currentPage - 1)"
            >Previous</a
          >
          <a
            href="#"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >Next</a
          >
        </div>
        <div
          class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ (currentPage - 1) * take }}</span>
              to
              <span class="font-medium">{{ currentPage * take }}</span>
              of
              <span class="font-medium">{{ tours?.total ?? 0 }}</span>
              results
            </p>
          </div>
          <div>
            <nav
              class="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <a
                href="#"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                @click.prevent="() => onPageChange(currentPage - 1)"
              >
                <span class="sr-only">Previous</span>
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
              <a
                v-for="p in pages"
                :key="p"
                aria-current="page"
                :class="[
                  'relative z-10 inline-flex items-center px-4 py-2',
                  'text-sm font-semibold',
                  p === currentPage
                    ? 'bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
                ]"
                @click.prevent="() => onPageChange(p)"
              >
                {{ p }}
              </a>
              <a
                href="#"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                @click.prevent="() => onPageChange(currentPage + 1)"
              >
                <span class="sr-only">Next</span>
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { format, formatDistance } from 'date-fns'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { useTours } from '~/composables/useTours'
import { useDeleteTour } from '~/composables/useDeleteTour'

export default {
  components: { TrashIcon },
  props: {
    travelId: { type: String, required: true },
    onDeleteTour: { type: Function, default: (_id: string) => undefined },
  },
  async setup($props) {
    const currentPage = ref(1)
    const skip = ref(0)
    const take = ref(20)
    const filter = {
      name: ref(undefined),
      startingDate: ref(undefined),
    }

    const { data: tours, refresh } = await useTours({
      ...filter,
      travelId: ref($props.travelId),
      skip,
      take,
    })

    const pages = ref(
      Array.from({
        length:
          (tours.value?.total ?? 0) < take.value
            ? 1
            : Math.ceil(tours.value?.total / 20),
      }).map((_, i) => i + 1)
    )

    return {
      currentPage,
      pages,
      skip,
      take,
      tours,
      refresh,
      format,
      formatDistance,
      filter,
    }
  },
  methods: {
    onPageChange(page: number) {
      if (page > 0) {
        this.currentPage = page
        this.skip = (page - 1) * this.take
      } else {
        this.currentPage = page
        this.skip = 0
      }
    },
    async onDelete(tourId: string) {
      await useDeleteTour(tourId)
      this.take--
    },
    onFilterChange(k: string) {
      return ($event: any) => {
        this.filter[k].value = $event.target.value
      }
    },
  },
}
</script>
