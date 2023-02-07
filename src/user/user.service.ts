import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './userDto/user-req.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // register
  async createUser(dto: CreateUserDto, hashedPassword: string) {
    if (await this.userModel.findOne({ phone: dto.phone }).exec()) {
      throw new HttpException('Number already taken', HttpStatus.BAD_REQUEST);
    }
    if (!(await this.userModel.findOne({ email: dto.email }).exec())) {
      const caughtPokemon = [];
      const user = await this.userModel.create({
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        caughtPokemon,
      });
      return `Successfully created account: ${user.email}`;
    } else {
      throw new HttpException('E-mail already taken', HttpStatus.BAD_REQUEST);
    }
  }

  // get user
  async getUser({ email }) {
    return this.userModel.findOne({
      email,
    });
  }
}
