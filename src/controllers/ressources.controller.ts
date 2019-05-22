import { Controller, Get, Param } from '@nestjs/common';
import { RessourcesService } from '../services/ressources.service';

@Controller('ressources')
export class RessourcesController {
  constructor(private readonly ressourcesService: RessourcesService) {}

  @Get('/countries/:country/categories/:category/subscribers/:range')
  async index(@Param() params) {
    return await this.ressourcesService.getRessoucesByCountriesAndCategories(
      params,
    );
  }
}
