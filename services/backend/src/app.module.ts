import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as path from 'path';
import { getConfig } from './mikro-orm.config';
import { ConfigModule } from './modules/config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { TourModule } from './modules/tour/tour.module';
import { TravelModule } from './modules/travel/travel.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule,
    MikroOrmModule.forRoot({
      ...getConfig(),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: 'graphql',
      playground: true,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
    }),
    AuthModule,
    UserModule,
    TourModule,
    TravelModule,
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
