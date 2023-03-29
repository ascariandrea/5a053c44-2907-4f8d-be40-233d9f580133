import { Module } from '@nestjs/common';
import { TourResolver } from './tour.resolver';
import { TourService } from './tour.service';
import { AuthModule } from '../auth/auth.module';
import { OrmModule } from '../orm/orm.module';
import { ConfigModule } from '../config/config.module';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { TravelService } from '../travel/travel.service';

@Module({
  imports: [ConfigModule, OrmModule, AuthModule],
  providers: [
    AuthService,
    UserService,
    TravelService,
    TourService,
    TourResolver,
  ],
  exports: [TourService],
})
export class TourModule {}
