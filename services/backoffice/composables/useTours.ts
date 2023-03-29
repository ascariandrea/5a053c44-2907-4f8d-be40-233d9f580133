import { Tour } from '@weroad-test/models/lib'
import { parseISO } from 'date-fns'
import { useAsyncData } from 'nuxt/app'
import { Ref, ref } from 'vue'

export const useTours = async ({
  travelId,
  skip = ref(0),
  take = ref(20),
  name = ref(undefined),
  startingDate = ref(undefined),
}: {
  travelId: Ref<string>
  skip?: Ref<number>
  take?: Ref<number>
  name?: Ref<string | undefined>
  startingDate?: Ref<string | undefined>
}): Promise<{
  data: Ref<{ total: number; tours: Tour.Tour[] } | null>
  refresh: (opts?: any) => void
}> => {
  const { data, refresh } = await useAsyncData(
    'getTours',
    () =>
      GqlGetTours({
        travelId: travelId.value,
        skip: skip.value,
        take: take.value,
        name: name.value,
        startingDate: startingDate.value,
      }),
    {
      transform(d: any) {
        return {
          total: d.getTours.total,
          tours:
            d.getTours.edges.map((e: any) => ({
              ...e.node,
              startingDate: parseISO(e.node.startingDate),
              endingDate: parseISO(e.node.endingDate),
            })) ?? [],
        }
      },
      watch: [take, skip, travelId, name, startingDate],
    }
  )

  return {
    data,
    refresh,
  }
}
