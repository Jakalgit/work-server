import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {TagService} from "./tag.service";
import {CreateTagDto} from "./dto/create-tag.dto";
import {ChangeNameDto} from "./dto/change-name.dto";
import { ChangeTagsDto } from './dto/change-tags.dto';

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

  @Put('/change-tags')
  changeTagAddiction(@Body() dto: ChangeTagsDto) {
    return this.tagService.changeTagAddiction(dto)
  }

  @Delete('/delete/:name')
  deleteTag(@Param('name') name: string) {
    return this.tagService.deleteTag(name)
  }

  @Get('/addiction/by-item-id/:id')
  getItemTagAddiction(@Param('id') itemId: number) {
    return this.tagService.getItemTagAddiction(itemId)
  }

  @Get('/one/:id')
  getOneTag(@Param('id') id: number) {
    return this.tagService.getOne(id)
  }

  @Get('/all')
  getAllTags() {
    return this.tagService.getAll()
  }
}
