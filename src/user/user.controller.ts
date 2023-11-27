import {Controller, Get, Param, Post} from '@nestjs/common';
import {UserService} from "./user.service";

@Controller('user')
export class UserController {

  constructor(private userService: UserService) {
  }

  @Post('/')
  createUser() {
    const token = Date.now().toString()
    return this.userService.createUser(token)
  }

  @Get('/:token')
  getUserByToken(@Param('token') token: string) {
    return this.userService.getUserByToken(token)
  }
}
