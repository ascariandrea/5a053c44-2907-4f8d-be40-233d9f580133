import {
  Cascade,
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
  @Property({ nullable: false })
  @Unique()
  email: string;

  @Property({ nullable: false })
  @Unique()
  username: string;

  @Property({ nullable: false, hidden: true })
  password: string;

  @ManyToMany({
    entity: () => UserPermissionEntity,
    inversedBy: 'users',
    eager: true,
    lazy: false,
    cascade: [Cascade.ALL],
  })
  permissions = new Collection<UserPermissionEntity>(this);

  @OneToMany({
    entity: () => TravelEntity,
    mappedBy: 'user',
    eager: false,
    cascade: [],
    lazy: true,
  })
  travels = new Collection<TravelEntity>(this);

  // @OneToMany({
  //   entity: () => TourEntity,
  //   mappedBy: 'participant',
  //   eager: false,
  //   cascade: [],
  //   lazy: true,
  // })
  // tours = new Collection<TourEntity>(this);
}
