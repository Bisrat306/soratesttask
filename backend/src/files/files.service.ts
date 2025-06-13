import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { File } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async create(
    file: Express.Multer.File,
    userId: string,
    folderId?: string,
  ): Promise<File> {
    const uploadDir = path.join(process.cwd(), 'uploads', userId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    return this.prisma.file.create({
      data: {
        name: file.originalname,
        path: filePath,
        mimetype: file.mimetype,
        size: file.size,
        userId,
        folderId,
      },
    });
  }

  async findAll(userId: string, folderId?: string): Promise<File[]> {
    return this.prisma.file.findMany({
      where: {
        userId,
        folderId,
      },
    });
  }

  async findOne(id: string, userId: string): Promise<File> {
    return this.prisma.file.findFirstOrThrow({
      where: {
        id,
        userId,
      },
    });
  }

  async remove(id: string, userId: string): Promise<File> {
    const file = await this.findOne(id, userId);

    try {
      fs.unlinkSync(file.path);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    return this.prisma.file.delete({
      where: {
        id,
        userId,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: { name: string },
  ): Promise<File> {
    return this.prisma.file.update({
      where: { id, userId },
      data: { name: data.name },
    });
  }
}
