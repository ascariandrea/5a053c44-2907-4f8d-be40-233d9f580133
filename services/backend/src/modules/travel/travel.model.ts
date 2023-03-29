import { Field, ObjectType, Int, ID } from '@nestjs/graphql';
import { Paginated } from '../../common/Paginated';
import { UserGQL } from '../user/user.model';
import { TourGQL } from '../tour/tour.model';

@ObjectType()
export class TravelMoodsGQL {
  @Field(() => Int)
  nature: number;

  @Field(() => Int)
  history: number;

  @Field(() => Int)
  relax: number;

  @Field(() => Int)
  party: number;

  @Field(() => Int)
  culture: number;
}

@ObjectType()
export class TravelGQL {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => String)
  slug: string;

  @Field(() => String)
  description: string;

  @Field(() => Int)
  numberOfDays: number;

  @Field(() => TravelMoodsGQL)
  moods: TravelMoodsGQL;

  @Field(() => UserGQL)
  creator: UserGQL;

  @Field(() => [TourGQL])
  tours: TourGQL[];
}

@ObjectType()
export class PaginatedTravels extends Paginated(TravelGQL) {}
