import { useAsyncData } from 'nuxt/app'
import { Ref } from 'vue'

export const useDoLogin = async (
  username: string,
  password: string
): Promise<Ref<string | undefined>> => {
  const { data } = await useAsyncData(
    'loginUser',
    () =>
      GqlLoginUser({
        loginData: {
          username,
          password,
        },
      }),
    {
      transform(d: any) {
        return d.loginUser.token
      },
    }
  )

  await useGqlToken(data.value)

  return data
}
