import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Folder } from '@prisma/client';

@Injectable()
export class FoldersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    userId: string;
    parentId?: string;
  }): Promise<Folder> {
    return this.prisma.folder.create({
      data,
    });
  }

  async findAll(userId: string, parentId?: string): Promise<Folder[]> {
    return this.prisma.folder.findMany({
      where: {
        userId,
        parentId: parentId || null,
      },
      include: {
        children: true,
        files: true,
      },
    });
  }

  async findOne(id: string, userId: string): Promise<Folder> {
    const folder = await this.prisma.folder.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        children: true,
        files: true,
      },
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    return folder;
  }

  async update(
    id: string,
    userId: string,
    data: { name: string },
  ): Promise<Folder> {
    const folder = await this.findOne(id, userId);
    return this.prisma.folder.update({
      where: { id: folder.id },
      data,
    });
  }

  async remove(id: string, userId: string): Promise<Folder> {
    const folder = await this.findOne(id, userId);
    return this.prisma.folder.delete({
      where: { id: folder.id },
    });
  }
}
