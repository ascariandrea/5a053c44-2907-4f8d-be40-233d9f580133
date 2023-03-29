import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../models';
import { UserEntity } from '../../entities';
import { ROLES_KEY } from './permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      User.UserPermission[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);
    // console.log({ requiredRoles });
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest() as {
      user: UserEntity;
    };
    // console.log('permission check for user', user);
    const perms = user.permissions.getItems().map((r) => r.permission);

    return requiredRoles.some((role) => perms.includes(role));
  }
}
