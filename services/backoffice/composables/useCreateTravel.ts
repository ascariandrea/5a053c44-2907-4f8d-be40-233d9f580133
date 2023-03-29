import { CreateTravelBody, Travel } from '@weroad-test/models/lib/Travel'
import { useAsyncData } from 'nuxt/app'
import { Ref } from 'vue'

export const useCreateTravel = async (
  travelData: CreateTravelBody
): Promise<Ref<Travel>> => {
  const { data } = await useAsyncData(
    'createTravel',
    () =>
      GqlCreateTravel({
        travelData,
      }),
    {
      transform(d: any) {
        return d.createTravel
      },
    }
  )

  return data
}
