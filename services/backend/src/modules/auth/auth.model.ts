import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class AuthGQL {
  @Field(() => ID)
  sub: string;

  @Field()
  token: string;

  @Field(() => [String])
  permissions: string[];

  constructor(sub: string, token: string, permissions: string[]) {
    this.sub = sub;
    this.token = token;
    this.permissions = permissions;
  }
}
