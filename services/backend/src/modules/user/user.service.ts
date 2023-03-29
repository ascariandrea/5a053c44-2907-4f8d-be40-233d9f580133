import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../../models/index';
import { UserPermissionEntity } from '../../entities/userPermission.entity';
import { UUID } from 'io-ts-types/lib/UUID';
import { UserEntity } from '../../entities';
import { decodeOrThrow } from '../../utils/fp.util';
import { UserRepository } from './user.repository';
import { UserPermRepository } from './userPerm.repository';
import { hash } from '../../utils/hash.utils';

const userDecoder = decodeOrThrow(User.User.decode, (e) => {
  return new HttpException(
    {
      message: `Validation failed for ${User.User.name}`,
      details: e,
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
});

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepository,
    @InjectRepository(UserPermissionEntity)
    private readonly userPermRepo: UserPermRepository,
  ) {}

  public static isAdmin(u: UserEntity): boolean {
    return !!u.permissions
      .getItems()
      .find((p) =>
        [
          User.USER_WRITE.value,
          User.USER_DEL.value,
          User.USER_ALL.value,
        ].includes(p.permission as any),
      );
  }

  async getUser(filter: Partial<UserEntity>): Promise<UserEntity | null> {
    return this.userRepo.findOne(
      {
        ...filter,
      },
      { populate: ['permissions'] },
    );
  }

  async findPermissions(
    perms: User.UserPermission[],
  ): Promise<UserPermissionEntity[]> {
    const allPerms = await this.userPermRepo.findAll();
    return allPerms.filter((p) => perms.includes(p.permission));
  }

  async findById(id: UUID): Promise<UserEntity> {
    return this.userRepo.findOneOrFail({
      id,
    });
  }

  async create({
    permissions,
    password,
    ...data
  }: User.CreateUserBody): Promise<UserEntity> {
    const hashedPassword = await hash(password, 10);
    const perms = await this.findPermissions(permissions);
    const user = this.userRepo.create({
      // TODO: it shouldn't be necessary to define base entity dates
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
      password: hashedPassword,
      permissions: perms,
    });

    await this.userRepo.persist(user).flush();

    const createdUser = await this.findById(user.id);
    await createdUser.permissions.init();

    return createdUser;
  }

  async delete(id: UUID) {
    await this.userRepo.nativeDelete({ id });
  }

  toUserIO(data: UserEntity) {
    return userDecoder({
      ...data,
      permissions: data.permissions.getItems().map((p) => p.permission),
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    });
  }
}
