import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class AuthGQL {
  @Field(() => ID)
  sub: string;

  @Field()
  username: string;

  @Field()
  token: string;

  @Field(() => [String])
  permissions: string[];
}
