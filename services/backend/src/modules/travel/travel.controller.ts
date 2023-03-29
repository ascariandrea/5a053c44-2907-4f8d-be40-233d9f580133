import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { Travel, User } from '../../models';
import { UUID } from 'io-ts-types/lib/UUID';
import { TravelEntity } from '../../entities';
import { Permissions } from '../../modules/permissions/permission.decorator';
import { IOTSValidationPipe } from '../../shared/pipes/IOTSValidation.pipe';
import { TravelService } from './travel.service';

@Controller('travels')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @Post()
  @UsePipes(new IOTSValidationPipe(Travel.CreateTravelBody))
  @Permissions(
    User.TRAVEL_WRITE.value,
    User.TRAVEL_DEL.value,
    User.TRAVEL_ALL.value,
  )
  async createTravel(
    @Req() req: any,
    @Body() body: Travel.CreateTravelBody,
  ): Promise<TravelEntity> {
    console.log('create travel data', { body });
    return this.travelService.create(body, req.user);
  }

  @Get()
  @UsePipes(new IOTSValidationPipe(Travel.GetTravelListQuery))
  async getTravels(@Query() query: Travel.GetTravelListQuery) {
    const { skip = 0, take = 20 } = query;
    const result = await this.travelService.getTravels({
      skip,
      take,
    });

    return { data: result[0], count: result[1] };
  }

  @Delete('/:id')
  @Permissions(User.TRAVEL_ALL.value, User.TRAVEL_DEL.value)
  async deleteTravel(@Param('id') id: UUID) {
    const travel = await this.travelService.findById(id);
    if (!travel) {
      throw new NotFoundException(`Can't find travel ${id}`);
    }

    await this.travelService.delete(id);
  }
}
