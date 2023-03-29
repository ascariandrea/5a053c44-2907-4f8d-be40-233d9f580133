import { ArgsType } from '@nestjs/graphql';
import { GetPaginatedListArgs } from '../../common/get-paginated-list.args';

@ArgsType()
export class GetTravelsArgs extends GetPaginatedListArgs {}
