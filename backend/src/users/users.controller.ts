import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as bcrypt from 'bcryptjs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(
    @Body()
    data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ) {
    const name = `${data.firstName} ${data.lastName}`;
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.usersService.create({
      email: data.email,
      name,
      password: hashedPassword,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() data: { name?: string }) {
    return this.usersService.update(id, data);
  }
}
