import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./user.model";

@Injectable()
export class UserService {

  constructor(@InjectModel(User) private userRepository: typeof User) {
  }

  async createUser(token: string) {
    let candidate = await this.userRepository.findOne({rejectOnEmpty: undefined, where: {token}})
    if (candidate) {
      throw new HttpException("Пользователь с таким токеном уже существует", HttpStatus.BAD_REQUEST)
    } else {
      candidate = await this.userRepository.create({token: token})
    }

    return candidate
  }

  async getUserByToken(token: string) {
    return await this.userRepository.findOne({rejectOnEmpty: undefined, where: {token}})
  }
}
