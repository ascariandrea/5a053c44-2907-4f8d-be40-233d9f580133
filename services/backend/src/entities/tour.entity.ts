import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { TravelEntity } from './travel.entity';
import { addDays } from 'date-fns';

@Entity({ tableName: 'tour' })
@Unique({ properties: ['name'] })
export class TourEntity extends BaseEntity {
  @Property()
  name: string;

  @Property()
  startingDate: Date;

  @Property({ persist: false })
  get endingDate() {
    return addDays(this.startingDate, this.travel.numberOfDays);
  }

  @Property()
  price: number;

  @ManyToOne({ entity: () => TravelEntity, eager: true })
  travel: TravelEntity;
}
