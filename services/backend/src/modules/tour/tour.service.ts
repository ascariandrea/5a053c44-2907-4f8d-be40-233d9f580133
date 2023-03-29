import { Injectable } from '@nestjs/common';

@Injectable()
export class TourService {
  getHello(): string {
    return 'Hello World!';
  }
}
