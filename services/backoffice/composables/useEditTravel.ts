import { useAsyncData } from 'nuxt/app'

export const useEditTravel = async (travelId: string, travelData: any) => {
  const { data } = await useAsyncData(
    'editTravel',
    () => GqlEditTravel({ travelId, travelData }),
    {
      transform(d: any) {
        return d.editTravel
      },
    }
  )
  return data
}
