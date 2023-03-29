import { SetMetadata } from '@nestjs/common';
import { User } from '@weroad-test/models/lib';

export const ROLES_KEY = 'permissions';
export const Permissions = (...permissions: User.UserPermission[]) =>
  SetMetadata(ROLES_KEY, permissions);
