import { EntityRepository } from '@mikro-orm/postgresql';
import { UserEntity } from '../../entities';

export class UserRepository extends EntityRepository<UserEntity> {}
