import { ArgsType, Field, ID } from '@nestjs/graphql';
import { UUID } from 'io-ts-types/lib/UUID';
import { GetPaginatedListArgs } from '../../common/get-paginated-list.args';

@ArgsType()
export class GetToursArgs extends GetPaginatedListArgs {
  @Field(() => ID)
  travelId: UUID;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  startingDate?: string;
}
