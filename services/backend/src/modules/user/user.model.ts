import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UUID } from 'io-ts-types/lib/UUID';

@ObjectType()
export class UserGQL {
  @Field(() => ID)
  id: UUID;

  @Field()
  username: string;

  @Field(() => [String])
  permissions: string[];
}
