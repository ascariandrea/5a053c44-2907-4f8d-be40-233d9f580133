import { Travel } from '@weroad-test/models/lib'
import { useAsyncData } from 'nuxt/app'
import { Ref, ref } from 'vue'

export const useTravels = async ({
  skip = ref(0),
  take = ref(20),
}: {
  skip?: Ref<number>
  take?: Ref<number>
}): Promise<Ref<{ total: number; travels: Travel.Travel[] } | null>> => {
  const { data } = await useAsyncData(
    'getTravels',
    () => GqlGetTravels({ skip: skip.value, take: take.value }),
    {
      transform(d: any) {
        return {
          total: d.getTravels.total,
          travels: d.getTravels?.edges?.map((t: any) => t.node) ?? [],
        }
      },
      watch: [skip, take],
    }
  )

  return data
}
