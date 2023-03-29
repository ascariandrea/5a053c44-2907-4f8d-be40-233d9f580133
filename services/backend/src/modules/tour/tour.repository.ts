import { EntityRepository } from '@mikro-orm/postgresql';
import { TourEntity } from '../../entities/tour.entity';

export class TourRepository extends EntityRepository<TourEntity> {}
