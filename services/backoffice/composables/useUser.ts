import { User } from '@weroad-test/models/lib'
import { AsyncData, useAsyncData } from 'nuxt/app'
import { Ref } from 'vue'
import { useAuth } from './useAuth'

export const useUser = async (): Promise<
  AsyncData<Ref<User.User | null>, any>
> => {
  const token = useAuth()

  const result = await useAsyncData(
    'getUser',
    () =>
      GqlGetUser({
        token: token.value,
      }),
    {
      transform(d: any) {
        return d.getUser
      },
      watch: [token],
    }
  )

  return result
}
