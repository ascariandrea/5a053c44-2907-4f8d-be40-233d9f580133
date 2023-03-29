import { Field, ArgsType, Int } from '@nestjs/graphql';

@ArgsType()
export class GetPaginatedListArgs {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  skip?: number;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  take?: number;
}
