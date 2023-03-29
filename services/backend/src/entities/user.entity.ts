import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { TravelEntity } from './travel.entity';
import { UserPermissionEntity } from './userPermission.entity';

@Entity({ tableName: 'user' })
@Unique({ properties: ['email', 'username'] })
export class UserEntity extends BaseEntity {
  @Property()
  email: string;

  @Property()
  username: string;

  @Property()
  password: string;

  @ManyToMany(() => UserPermissionEntity, 'users', {
    eager: false,
    cascade: undefined,
  })
  permissions = new Collection<UserPermissionEntity>(this);

  @OneToMany(() => TravelEntity, (t) => t.user, { eager: true })
  travels = new Collection<TravelEntity>(this);

  constructor(email: string, username: string, password: string) {
    super();
    this.email = email;
    this.username = username;
    this.password = password;
  }
}
