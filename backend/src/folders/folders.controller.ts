import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FoldersService } from './folders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../decorators/user.decorator';

@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  async create(
    @Body() data: { name: string; parentId?: string },
    @User('id') userId: string,
  ) {
    return this.foldersService.create({ ...data, userId });
  }

  @Get()
  async findAll(
    @User('id') userId: string,
    @Query('parentId') parentId?: string,
  ) {
    return this.foldersService.findAll(userId, parentId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User('id') userId: string) {
    return this.foldersService.findOne(id, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { name: string },
    @User('id') userId: string,
  ) {
    return this.foldersService.update(id, userId, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User('id') userId: string) {
    return this.foldersService.remove(id, userId);
  }
}
