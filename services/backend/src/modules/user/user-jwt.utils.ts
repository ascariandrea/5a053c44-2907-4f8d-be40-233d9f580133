import { User } from '@weroad-test/models/src';
import { AuthGQL } from '../auth/auth.model';

export const toJWTUser = (u: User.User): Omit<AuthGQL, 'token'> => {
  return {
    sub: u.id,
    username: u.username,
    permissions: u.permissions,
  };
};
