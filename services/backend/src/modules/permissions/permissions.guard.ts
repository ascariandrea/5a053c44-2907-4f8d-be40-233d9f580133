import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@weroad-test/models/lib';
import { ROLES_KEY } from './permission.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      User.UserPermission[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) {
      return false;
    }
    const { user } = GqlExecutionContext.create(context).getContext().req;

    const userPerms = user.permissions.getItems();

    const perms = userPerms.map((r: any) => r.permission);

    return requiredRoles.some((role) => perms.includes(role));
  }
}
