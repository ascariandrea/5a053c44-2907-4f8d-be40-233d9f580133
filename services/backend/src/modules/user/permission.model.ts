import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PermissionGQL {
  @Field()
  permission: string;

  constructor(permission: string) {
    this.permission = permission;
  }
}
