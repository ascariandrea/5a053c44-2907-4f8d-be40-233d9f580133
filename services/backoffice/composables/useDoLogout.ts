export const useDoLogout = () => {
  return {
    onLogout: async () => {
      await useGqlToken(null)
      await useGqlHeaders(null)
    },
  }
}
