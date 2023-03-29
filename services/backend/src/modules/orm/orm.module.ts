import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import {
  TourEntity,
  TravelEntity,
  UserEntity,
  UserPermissionEntity,
} from '../../entities';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [UserEntity, UserPermissionEntity, TravelEntity, TourEntity],
    }),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule {}
