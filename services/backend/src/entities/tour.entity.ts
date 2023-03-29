import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { TravelEntity } from './travel.entity';

@Entity({ tableName: 'tour' })
export class TourEntity extends BaseEntity {
  @Property()
  name: string;

  @Property()
  startingDate: Date;

  @Property()
  endingDate: Date;

  @Property()
  price: number;

  @ManyToOne(() => TravelEntity)
  travel: TravelEntity;

  constructor(
    name: string,
    startingDate: Date,
    endingDate: Date,
    price: number,
    travel: TravelEntity,
  ) {
    super();
    this.name = name;
    this.startingDate = startingDate;
    this.endingDate = endingDate;
    this.price = price;
    this.travel = travel;
  }
}
