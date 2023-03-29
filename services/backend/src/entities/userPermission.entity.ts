import {
  Collection,
  Entity,
  ManyToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { User } from '../models';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'user_permission' })
@Unique({ properties: ['permission'] })
export class UserPermissionEntity extends BaseEntity {
  @Property()
  permission: User.UserPermission;

  @ManyToMany(() => UserEntity)
  users = new Collection<UserEntity>(this);

  constructor(role: User.UserPermission) {
    super();
    this.permission = role;
  }
}
