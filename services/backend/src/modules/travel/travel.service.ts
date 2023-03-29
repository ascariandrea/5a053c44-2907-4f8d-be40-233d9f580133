import { InjectRepository } from '@mikro-orm/nestjs';
import { Travel } from '../../models';
import { TravelEntity } from '../../entities/travel.entity';
import { TravelRepository } from './travel.repository';
import { UUID } from 'io-ts-types/lib/UUID';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TravelService {
  constructor(
    @InjectRepository(TravelEntity)
    private readonly travelRepo: TravelRepository,
  ) {}

  async create(
    data: Travel.CreateTravelBody,
    userId: UUID,
  ): Promise<TravelEntity> {
    const travel = this.travelRepo.create({
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
      user: { id: userId },
    });

    await this.travelRepo.persist(travel).flush();

    return travel;
  }

  async findById(id: UUID): Promise<TravelEntity> {
    return this.travelRepo.findOneOrFail({ id });
  }

  async getTravels(params: {
    skip: number;
    take: number;
  }): Promise<[TravelEntity[], number]> {
    return this.travelRepo.findAndCount(
      {},
      {
        offset: params.skip,
        limit: params.take,
      },
    );
  }

  async delete(id: UUID) {
    await this.travelRepo.nativeDelete({ id });
  }
}
