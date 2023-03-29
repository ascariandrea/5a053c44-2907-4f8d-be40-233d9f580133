import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetUsersArgs {
  @Field({ nullable: true })
  username?: string;

  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  take: number;
}
