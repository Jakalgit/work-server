import {Body, Controller, Delete, Param, Post, Put} from '@nestjs/common';
import {ColorService} from "./color.service";
import {CreateColorDto} from "./dto/create-color.dto";
import {ChangeNameDto} from "./dto/change-name.dto";

@Controller('color')
export class ColorController {

  constructor(private colorService: ColorService) {
  }

  @Post('/')
  create(@Body() dto: CreateColorDto) {
    return this.colorService.create(dto)
  }

  @Put('/')
  changeName(@Body() dto: ChangeNameDto) {
    return this.colorService.changeName(dto)
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.colorService.delete(id)
  }

}
