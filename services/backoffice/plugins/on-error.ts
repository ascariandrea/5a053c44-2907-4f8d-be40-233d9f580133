import { defineNuxtPlugin } from 'nuxt/app'

export const isUserNotFound = (e: any) =>
  e.path.includes('getUser') && e.extensions?.originalError?.statusCode === 404

export default defineNuxtPlugin(() => {
  useGqlError((err) => {
    // Only log during development
    if (process.env.NODE_ENV !== 'production') {
      for (const gqlError of err.gqlErrors) {
        // eslint-disable-next-line
        console.error('[nuxt-graphql-client] [GraphQL error]', {
          client: err.client,
          statusCode: err.statusCode,
          operationType: err.operationType,
          operationName: err.operationName,
          gqlError,
        })
      }
    }
    // Handle different error cases

    const userNotFound = err.gqlErrors.find(isUserNotFound)
    if (userNotFound) {
      // eslint-disable-next-line
      console.log('user not found', userNotFound)
      Promise.all([useGqlToken(null), useGqlHeaders(null)])

      // todo: not a real error - for now :)
    }
  })
})
