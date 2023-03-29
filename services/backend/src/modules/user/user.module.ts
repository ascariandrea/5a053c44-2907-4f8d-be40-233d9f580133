import {
MiddlewareConsumer,
Module,
NestModule,
RequestMethod,
forwardRef,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from '../auth/auth.middleware';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { GqlAuthGuard } from '../auth/gql-jwt-auth.guard';
import { OrmModule } from '../orm/orm.module';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [OrmModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [
    { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_GUARD, useClass: GqlAuthGuard },
    AuthService,
    UserService,
    UserResolver,
  ],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.GET },
        { path: 'users', method: RequestMethod.PUT },
        { path: 'users', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.DELETE },
      );
  }
}
