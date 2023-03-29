import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { User } from '../../models';
import { IOTSValidationPipe } from '../../shared/pipes/IOTSValidation.pipe';
import { Permissions } from '../permissions/permission.decorator';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @Permissions(User.USER_DEL.value, User.USER_WRITE.value, User.USER_ALL.value)
  @UsePipes(new IOTSValidationPipe(User.CreateUserBody))
  async createUser(@Body() body: User.CreateUserBody): Promise<User.User> {
    const user = await this.userService.create(body);

    return this.userService.toUserIO(user);
  }

  @Post('/login')
  @UsePipes(new IOTSValidationPipe(User.LoginUserBody))
  async login(@Body() body: User.LoginUserBody) {
    console.log('login', body);
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );

    if (!user) {
      throw new HttpException(`User is missing`, HttpStatus.NOT_FOUND);
    }

    return this.authService.login(user);
  }
}
