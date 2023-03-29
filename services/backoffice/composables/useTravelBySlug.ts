import { Ref } from 'vue'
import { Travel } from '@weroad-test/models/lib'

export const useTravelBySlug = async (
  slug: string
): Promise<Ref<Travel.Travel>> => {
  const { data } = await useAsyncData(
    'getTravelBySlug',
    () =>
      GqlGetTravelBySlug({
        slug,
      }),
    {
      transform(d: any) {
        return d?.getTravelBySlug
      },
    }
  )

  return data
}
