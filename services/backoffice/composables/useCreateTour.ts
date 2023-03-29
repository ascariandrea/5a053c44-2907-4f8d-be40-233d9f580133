import { CreateTourBody, Tour } from '@weroad-test/models/lib/Tour'
import { Ref } from 'vue'

export const useCreateTour = async (
  tourData: CreateTourBody
): Promise<Ref<Tour>> => {
  const { data } = await useAsyncGql({
    operation: 'createTour',
    variables: { tourData },
    transform(d: any) {
      return d.createTour
    },
  })

  return data
}
