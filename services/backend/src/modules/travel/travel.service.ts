import { InjectRepository } from '@mikro-orm/nestjs';
import { Travel } from '@weroad-test/models/lib';
import { TravelEntity } from '../../entities/travel.entity';
import { TravelRepository } from './travel.repository';
import { UUID } from 'io-ts-types/lib/UUID';
import { Injectable } from '@nestjs/common';
import {
  EntityData,
  FilterQuery,
  FindOneOptions,
  FindOneOrFailOptions,
  FindOptions,
} from '@mikro-orm/core';

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

    return this.findById(travel.id);
  }

  async editTravel(
    travelId: UUID,
    data: EntityData<TravelEntity>,
  ): Promise<TravelEntity> {
    const t = await this.findById(travelId);
    const travel = await this.travelRepo.upsert({
      ...data,
      moods: data.moods ? JSON.stringify(data.moods) : (t.moods as any),
      id: travelId,
    });

    await this.travelRepo.persistAndFlush(travel);
    return this.findById(travelId, {
      populate: ['user'],
    });
  }

  async findById(
    id: UUID,
    opts?: FindOneOrFailOptions<TravelEntity, 'user'>,
  ): Promise<TravelEntity> {
    return this.travelRepo.findOneOrFail({ id }, opts);
  }

  async getTravel(
    q: FilterQuery<TravelEntity>,
    opts?: FindOneOptions<TravelEntity, 'user'>,
  ): Promise<TravelEntity | null> {
    return this.travelRepo.findOne(q, opts);
  }

  async getTravels(
    query: FilterQuery<TravelEntity>,
    opts: FindOptions<TravelEntity>,
  ): Promise<[TravelEntity[], number]> {
    return this.travelRepo.findAndCount(query, opts);
  }

  async delete(id: UUID) {
    await this.travelRepo.nativeDelete({ id });
  }

  toTravelIO(t: TravelEntity): Travel.Travel {
    return {
      ...t,
      creator: {
        ...t.user,
        permissions: [],
      },
    };
  }
}
