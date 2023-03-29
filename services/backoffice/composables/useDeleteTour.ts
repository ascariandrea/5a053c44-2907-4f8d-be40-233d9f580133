import { useAsyncData } from 'nuxt/app'

export const useDeleteTour = async (tourId: string) => {
  const { data } = await useAsyncData(
    'deleteTour',
    () =>
      GqlDeleteTour({
        tourId,
      }),
    {
      transform(d: any) {
        return d.deleteTour
      },
    }
  )

  return data
}
