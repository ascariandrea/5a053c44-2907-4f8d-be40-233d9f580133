import { defineNuxtRouteMiddleware, useCookie, useNuxtApp } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  const { $config } = useNuxtApp()
  if (typeof to.name === 'string') {
    const token = useCookie($config.public.AUTH_COOKIE_NAME)
    if (!['login', 'logout'].includes(to.name)) {
      if (!token.value) {
        return '/login'
      }
    } else if (to.name === 'login') {
      if (token.value) {
        return '/'
      }
    }
  }
})
