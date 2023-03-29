import { Controller, Get } from '@nestjs/common';
import { TourService } from './tour.service';

@Controller('tours')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Get()
  getToursList(): string {
    return this.tourService.getHello();
  }
}
