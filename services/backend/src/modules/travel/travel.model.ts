import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TravelGQL {
  @Field()
  id: string;

  @Field()
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
