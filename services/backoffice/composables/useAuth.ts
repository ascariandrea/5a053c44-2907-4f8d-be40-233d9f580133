import { CookieRef, useCookie, useNuxtApp } from 'nuxt/app'

export const useAuth = (): CookieRef<string | null> => {
  const { $config } = useNuxtApp()

  const token = useCookie($config.public.AUTH_COOKIE_NAME, { watch: true })

  return token
}
