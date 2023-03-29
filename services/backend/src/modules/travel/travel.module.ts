import {
MiddlewareConsumer,
Module,
NestModule,
RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from '../auth/auth.middleware';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { GqlAuthGuard } from '../auth/gql-jwt-auth.guard';
import { ConfigModule } from '../config/config.module';
import { OrmModule } from '../orm/orm.module';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { UserService } from '../user/user.service';
import { TravelController } from './travel.controller';
import { TravelResolver } from './travel.resolver';
import { TravelService } from './travel.service';

@Module({
  imports: [ConfigModule, OrmModule, AuthModule],
  controllers: [TravelController],
  providers: [
    { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_GUARD, useClass: GqlAuthGuard },
    AuthService,
    UserService,
    TravelService,
    TravelResolver,
  ],
  exports: [TravelService],
})
export class TravelModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'travels', method: RequestMethod.POST },
        { path: 'travels', method: RequestMethod.PUT },
        { path: 'travels', method: RequestMethod.DELETE },
      );
  }
}
