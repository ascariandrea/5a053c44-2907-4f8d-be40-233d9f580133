import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { OrmModule } from '../orm/orm.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [OrmModule, forwardRef(() => AuthModule)],
  controllers: [],
  providers: [AuthService, UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
