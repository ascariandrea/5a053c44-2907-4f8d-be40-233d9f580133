import { SetMetadata } from '@nestjs/common';
import { User } from '../../models';

export const ROLES_KEY = 'permissions';
export const Permissions = (...permissions: User.UserPermission[]) =>
  SetMetadata(ROLES_KEY, permissions);
