import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  Res,
  StreamableFile,
  Put,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream } from 'fs';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @User('id') userId: string,
    @Query('folderId') folderId?: string,
  ) {
    return this.filesService.create(file, userId, folderId);
  }

  @Get()
  async findAll(
    @User('id') userId: string,
    @Query('folderId') folderId?: string,
  ) {
    return this.filesService.findAll(userId, folderId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User('id') userId: string) {
    return this.filesService.findOne(id, userId);
  }

  @Get(':id/preview')
  async previewFile(
    @Param('id') id: string,
    @User('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.filesService.findOne(id, userId);
    const fileStream = createReadStream(file.path);

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `inline; filename="${file.name}"`,
    });

    return new StreamableFile(fileStream);
  }

  @Get(':id/download')
  async downloadFile(
    @Param('id') id: string,
    @User('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.filesService.findOne(id, userId);
    const fileStream = createReadStream(file.path);

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.name}"`,
    });

    return new StreamableFile(fileStream);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User('id') userId: string) {
    return this.filesService.remove(id, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { name: string },
    @User('id') userId: string,
  ) {
    return this.filesService.update(id, userId, data);
  }
}
