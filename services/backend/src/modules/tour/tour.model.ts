import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/Paginated';
import { TravelGQL } from '../travel/travel.model';

@ObjectType()
export class TourGQL {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  price: number;

  @Field(() => Date)
  startingDate: Date;

  @Field(() => Date)
  endingDate: Date;

  @Field(() => TravelGQL)
  travel: TravelGQL;
}

@ObjectType()
export class PaginatedTours extends Paginated(TourGQL) {}
