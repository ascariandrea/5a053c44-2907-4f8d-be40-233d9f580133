import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserGQL {
  @Field()
  id: string;

  @Field()
  username: string;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
  }
}
