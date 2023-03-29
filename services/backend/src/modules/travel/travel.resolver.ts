import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  TRAVEL_ALL,
  TRAVEL_DEL,
  TRAVEL_WRITE,
  User,
} from '@weroad-test/models/lib/User';
import { UUID } from 'io-ts-types/lib/UUID';
import { TourEntity, TravelEntity } from '../../entities';
import { CurrentUser } from '../auth/current-user.decorator.graphql';
import { GqlAuthGuard } from '../auth/gql-jwt-auth.guard';
import { Permissions } from '../permissions/permission.decorator';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { UserService } from '../user/user.service';
import { CreateTravelData } from './create-travel.input';
import { EditTravelData } from './edit-travel.input';
import { GetTravelsArgs } from './get-travels.args';
import { PaginatedTravels, TravelGQL } from './travel.model';
import { TravelService } from './travel.service';

@Resolver(() => TravelGQL)
export class TravelResolver {
  constructor(
    private travelService: TravelService,
    private userService: UserService,
  ) {}

  @Query(() => PaginatedTravels)
  async getTravels(
    @Args() { skip, take, ...others }: GetTravelsArgs,
  ): Promise<PaginatedTravels> {
    const result = await this.travelService.getTravels(
      {},
      {
        offset: skip ?? 0,
        limit: take ?? 20,
        orderBy: { updatedAt: -1 },
        ...others,
      },
    );
    return {
      total: result[1],
      edges: result[0].map((t) => ({
        node: this.buildTravelGQL(t, []),
      })),
    };
  }

  @Query(() => TravelGQL)
  async getTravelById(@Args('id') id: UUID) {
    const travel = await this.travelService.findById(id);
    await travel.tours.init();
    return this.buildTravelGQL(travel, travel.tours.getItems());
  }

  @Query(() => TravelGQL)
  async getTravelBySlug(@Args('slug') slug: string) {
    const travel = await this.travelService.getTravel(
      { slug },
      {
        populate: ['user'],
      },
    );

    await travel?.tours.init();

    if (travel) {
      // await travel.user.permissions.init();
      return this.buildTravelGQL(travel, travel.tours.getItems());
    }

    throw new NotFoundException(`Cannot find travel with slug "${slug}"`);
  }

  @Permissions(TRAVEL_WRITE.value, TRAVEL_ALL.value)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Mutation(() => TravelGQL)
  async createTravel(
    @Args('travelData') travelData: CreateTravelData,
    @CurrentUser() user: User,
  ) {
    const travel = await this.travelService.create(travelData, user.id);

    return this.buildTravelGQL(travel, []);
  }

  @Permissions(TRAVEL_WRITE.value, TRAVEL_DEL.value, TRAVEL_ALL.value)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Mutation(() => TravelGQL)
  async editTravel(
    @Args('travelId') travelId: UUID,
    @Args('travelData') { userId, ...travelData }: EditTravelData,
  ) {
    const user = await this.userService.findById(userId);

    await this.travelService.editTravel(travelId, {
      ...travelData,
      user,
    });

    const travel = await this.travelService.findById(travelId);

    await travel.tours.init();

    return this.buildTravelGQL(travel, travel.tours.getItems());
  }

  buildTravelGQL({ user, ...t }: TravelEntity, tours: TourEntity[]): TravelGQL {
    const travel = {
      ...t,
      moods: typeof t.moods === 'string' ? JSON.parse(t.moods as any) : t.moods,
      creator: {
        id: user.id,
        username: user.username,
        permissions: user.permissions.getItems().map((p) => p.permission),
      },
    };
    return {
      ...travel,
      tours: tours.map((tour) => ({
        ...tour,
        endingDate: tour.endingDate,
        travel: { ...travel, tours: [] },
      })),
    };
  }
}
