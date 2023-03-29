import { Field, ArgsType, Int } from '@nestjs/graphql';

@ArgsType()
export class GetTravelsArgs {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  skip: number;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  take: number;

  constructor(skip: number, take: number) {
    this.skip = skip;
    this.take = take;
  }
}
