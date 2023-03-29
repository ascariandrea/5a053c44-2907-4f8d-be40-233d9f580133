import { Field, InputType } from '@nestjs/graphql';
import { UUID } from 'io-ts-types/lib/UUID';

@InputType()
export class CreateTourData {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field(() => Date)
  startingDate: Date;

  @Field()
  travelId: UUID;
}
