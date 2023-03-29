import { Field, ID, InputType } from '@nestjs/graphql';
import { CreateTravelData } from './create-travel.input';
import { UUID } from 'io-ts-types/lib/UUID';

@InputType()
export class EditTravelData extends CreateTravelData {
  @Field(() => ID)
  userId: UUID;
}
