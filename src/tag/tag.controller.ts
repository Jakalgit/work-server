import {Body, Controller, Delete, Param, Post, Put} from '@nestjs/common';
import {TagService} from "./tag.service";
import {CreateTagDto} from "./dto/create-tag.dto";
import {ChangeNameDto} from "./dto/change-name.dto";

@Controller('tag')
export class TagController {

  constructor(private tagService: TagService) {
  }

  @Post('/')
  create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto)
  }

  @Put('/change-name')
  changeName(@Body() dto: ChangeNameDto) {
    return this.tagService.changeName(dto)
  }

  @Delete('/:id')
  deleteTag(@Param('id') id: number) {
    return this.tagService.deleteTag(id)
  }
}
