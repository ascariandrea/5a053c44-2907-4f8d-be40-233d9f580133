import { User } from '@weroad-test/models/lib'

export const useUsers = async (filter: any): Promise<User.User[]> => {
  const { data } = await useAsyncGql({
    operation: 'getUsers',
    variables: { filter },
  })
  return data.value?.getUsers ?? []
}
