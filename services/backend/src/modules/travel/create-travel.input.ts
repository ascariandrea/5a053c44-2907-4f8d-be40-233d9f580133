import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TravelMoodsInput {
  @Field()
  nature: number;
  @Field()
  relax: number;
  @Field()
  history: number;
  @Field()
  culture: number;

  @Field()
  party: number;
}

@InputType()
export class CreateTravelData {
  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  description: string;

  @Field()
  numberOfDays: number;

  @Field()
  moods: TravelMoodsInput;
}
