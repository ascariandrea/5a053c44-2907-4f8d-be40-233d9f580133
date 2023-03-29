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

  constructor(
    nature: number,
    relax: number,
    history: number,
    culture: number,
    party: number,
  ) {
    this.nature = nature;
    this.relax = relax;
    this.history = history;
    this.culture = culture;
    this.party = party;
  }
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

  constructor(
    name: string,
    slug: string,
    description: string,
    numberOfDays: number,
    moods: TravelMoodsInput,
  ) {
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.numberOfDays = numberOfDays;
    this.moods = moods;
  }
}
