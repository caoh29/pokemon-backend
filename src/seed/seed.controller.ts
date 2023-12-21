import { Body, Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { CreateSeedDto } from './dto/create-seed.dto';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  seedDB(@Body() createSeedDto: CreateSeedDto) {
    return this.seedService.seedDB(createSeedDto);
  }
}
