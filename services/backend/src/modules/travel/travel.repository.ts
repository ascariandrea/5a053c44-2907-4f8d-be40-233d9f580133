import { EntityRepository } from '@mikro-orm/postgresql';
import { TravelEntity } from '../../entities/travel.entity';

export class TravelRepository extends EntityRepository<TravelEntity> {}
