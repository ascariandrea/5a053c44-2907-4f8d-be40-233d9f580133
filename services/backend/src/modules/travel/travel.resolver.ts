import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UUID } from 'io-ts-types/lib/UUID';
import { User } from '../../models/User';
import { CurrentUser } from '../auth/current-user.decorator.graphql';
import { GqlAuthGuard } from '../auth/gql-jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { CreateTravelData } from './create-travel.input';
import { GetTravelsArgs } from './get-travels.args';
import { TravelGQL } from './travel.model';
import { TravelService } from './travel.service';

@Resolver(() => TravelGQL)
export class TravelResolver {
  constructor(private travelService: TravelService) {}

  @Query(() => [TravelGQL])
  async getTravels(@Args() opts: GetTravelsArgs) {
    const result = await this.travelService.getTravels(opts);
    console.log(result);
    return result[0];
  }

  @Query(() => TravelGQL)
  async getTravelById(@Args('id') id: UUID) {
    return this.travelService.findById(id);
  }

  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Mutation(() => TravelGQL)
  async createTravel(
    @Args('travelData') travelData: CreateTravelData,
    @CurrentUser() user: User,
  ) {
    return this.travelService.create(travelData, user.id);
  }
}
