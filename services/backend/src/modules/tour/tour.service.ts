import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UUID } from 'io-ts-types/lib/UUID';
import { TourEntity } from '../../entities/tour.entity';
import { CreateTourData } from './create-tour.input';
import { TourRepository } from './tour.repository';
import { FilterQuery, FindOneOrFailOptions } from '@mikro-orm/core';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(TourEntity)
    private readonly tourRepo: TourRepository,
  ) {}

  async create({ travelId, ...data }: CreateTourData) {
    const tour = this.tourRepo.create({
      createdAt: new Date(),
      updatedAt: new Date(),
      // todo: this is defined because the compiler complains
      // even though this is a virtual property and
      // so the value shouldn't affect the operation
      endingDate: new Date(),
      ...data,
      travel: { id: travelId },
    });

    await this.tourRepo.persist(tour).flush();

    return this.findById(tour.id, { populate: ['travel'] });
  }

  async findById(
    id: UUID,
    opts?: FindOneOrFailOptions<TourEntity, 'travel'>,
  ): Promise<TourEntity> {
    return this.tourRepo.findOneOrFail({ id }, opts);
  }

  async getTours(params: {
    name?: string;
    travelId?: string;
    skip: number;
    take: number;
    startingDate?: string;
  }): Promise<[TourEntity[], number]> {
    const findOpts: FilterQuery<TourEntity> = {};
    if (params.name) {
      findOpts.name = { $like: `%${params.name}%` };
    }
    if (params.travelId) {
      findOpts.travel = {
        id: params.travelId,
      };
    }

    if (params.startingDate) {
      // const startingDate = new Date(params.startingDate as any);
      findOpts.startingDate = {
        $gte: params.startingDate,
      };
    }

    return this.tourRepo.findAndCount(findOpts, {
      offset: params.skip,
      limit: params.take,
      orderBy: { createdAt: -1 },
    });
  }

  async delete(id: UUID) {
    await this.tourRepo.nativeDelete({ id });
  }
}
