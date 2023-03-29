import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
// import { plainToClass } from 'class-transformer';
// import { validate } from 'class-validator';
import { failure } from 'io-ts/lib/PathReporter';
import { E } from '../../utils/fp.util';
import * as t from 'io-ts';

@Injectable()
export class IOTSValidationPipe<P extends t.Props> implements PipeTransform<P> {
  constructor(private readonly schema: t.TypeC<P> | t.ExactC<t.TypeC<P>>) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('No data submitted');
    }

    const { metatype } = metadata;
    if (!metatype) {
      return value;
    }
    const result = this.schema.decode(value);
    if (E.isRight(result)) {
      return result.right;
    }

    throw new HttpException(
      { message: 'Input data validation failed', errors: failure(result.left) },
      HttpStatus.BAD_REQUEST,
    );
  }
}
