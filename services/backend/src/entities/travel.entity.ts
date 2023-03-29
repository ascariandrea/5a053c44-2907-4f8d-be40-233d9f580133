import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToMany,
  Property,
  Ref,
  Unique,
} from '@mikro-orm/core';
import { Travel } from '@weroad-test/models/lib';
import { TravelRepository } from '../modules/travel/travel.repository';
import { BaseEntity } from './base.entity';
import { TourEntity } from './tour.entity';
import { UserEntity } from './user.entity';

@Entity({
  tableName: 'travel',
  customRepository: () => TravelRepository,
})
@Unique({ properties: ['slug'] })
export class TravelEntity extends BaseEntity {
  [EntityRepositoryType]?: TravelRepository;

  @Property({ nullable: false })
  slug: string;

  @Property({ nullable: false })
  name: string;

  @Property({ nullable: false })
  description: string;

  @Property({ type: 'int' })
  numberOfDays: number;

  @Property({ type: 'json' })
  moods: Travel.Travel['moods'];

  @OneToMany({
    entity: () => TourEntity,
    mappedBy: 'travel',
    eager: false,
    cascade: [Cascade.PERSIST],
  })
  tours = new Collection<TourEntity>(this);

  @ManyToOne({
    entity: () => UserEntity,
    eager: true,
    cascade: [],
    inversedBy: 'travels',
  })
  user: UserEntity;
}
