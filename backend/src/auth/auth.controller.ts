import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password?: string }) {
    const user = await this.authService.validateUser(body.email);
    if (!user) {
      return { error: 'User not found' };
    }
    if (body.password) {
      const isMatch = await bcrypt.compare(body.password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Incorrect password');
      }
      return this.authService.login(user);
    }
    // If only email is provided, just validate user
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
