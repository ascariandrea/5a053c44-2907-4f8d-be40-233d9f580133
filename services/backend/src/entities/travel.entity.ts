import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Travel } from '../models';
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

  @Property()
  slug: string;

  @Property()
  name: string;

  @Property()
  description: string;

  @Property({ type: 'int' })
  numberOfDays: number;

  @Property({ type: 'json' })
  moods: Travel.Travel['moods'];

  @OneToMany(() => TourEntity, (t) => t.travel, { cascade: undefined })
  tours = new Collection<TourEntity>(this);

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  constructor(
    slug: string,
    name: string,
    description: string,
    numberOfDays: number,
    moods: any,
    user: UserEntity,
  ) {
    super();
    this.slug = slug;
    this.name = name;
    this.description = description;
    this.numberOfDays = numberOfDays;
    this.moods = moods;
    this.user = user;
  }
}
