import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { ConfigModule } from '../config/config.module';
import { OrmModule } from '../orm/orm.module';
import { UserService } from '../user/user.service';
import { TravelResolver } from './travel.resolver';
import { TravelService } from './travel.service';

@Module({
  imports: [ConfigModule, OrmModule, AuthModule],
  controllers: [],
  providers: [AuthService, UserService, TravelService, TravelResolver],
  exports: [TravelService],
})
export class TravelModule {}
