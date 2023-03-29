import { defineNuxtPlugin, useCookie } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  // access cookie for auth
  const cookie = useCookie(nuxtApp.$config.public.AUTH_COOKIE_NAME).value

  nuxtApp.hook('gql:auth:init', ({ token }) => {
    // `client` can be used to differentiate logic on a per client basis.
    // apply apollo client token
    token.value = cookie
  })
})
