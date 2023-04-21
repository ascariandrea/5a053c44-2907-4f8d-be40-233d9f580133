import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TourEntity } from '../../entities/tour.entity';
import { TravelService } from '../travel/travel.service';
import { GetToursArgs } from './get-tours.args';
import { PaginatedTours, TourGQL } from './tour.model';
import { TourService } from './tour.service';
import { CreateTourData } from './create-tour.input';
import { Permissions } from '../permissions/permission.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { User } from '@weroad-test/models/lib';
import { UUID } from 'io-ts-types/lib/UUID';

@Resolver(() => TourGQL)
export class TourResolver {
  constructor(
    private readonly tourService: TourService,
    private readonly travelService: TravelService,
  ) {}

  @Permissions(User.TOUR_WRITE.value, User.TOUR_DEL.value, User.TOUR_ALL.value)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Mutation(() => TourGQL)
  async createTour(@Args('tourData') tourData: CreateTourData) {
    const travel = await this.travelService.findById(tourData.travelId);
    const tour = await this.tourService.create({ ...tourData });

    return this.buildTourGQL({ ...tour, endingDate: tour.endingDate, travel });
  }

  @Query(() => PaginatedTours)
  async getTours(@Args() opts: GetToursArgs): Promise<PaginatedTours> {
    const result = await this.tourService.getTours({
      skip: 0,
      take: 20,
      ...opts,
    });

    return {
      total: result[1],
      edges: result[0].map((t) => ({
        node: this.buildTourGQL(t),
      })),
    };
  }

  @Permissions(User.TOUR_DEL.value, User.TOUR_ALL.value)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Mutation(() => TourGQL)
  async deleteTour(@Args('tourId') tourId: UUID) {
    const tour = await this.tourService.findById(tourId);

    await this.tourService.delete(tourId);

    return this.buildTourGQL({ ...tour, endingDate: tour.endingDate });
  }

  buildTourGQL(t: TourEntity): TourGQL {
    return {
      ...t,
      endingDate: t.endingDate,
      travel: { ...this.travelService.toTravelIO(t.travel), tours: [] },
    };
  }
}
