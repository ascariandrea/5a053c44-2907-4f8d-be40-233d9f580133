import { EntityRepository } from '@mikro-orm/postgresql';
import { UserPermissionEntity } from '../../entities/userPermission.entity';

export class UserPermRepository extends EntityRepository<UserPermissionEntity> {}
