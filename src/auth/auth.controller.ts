import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async singIn(@Body() user: AuthDto): Promise<{ access_token: string }> {
    return this.authService.logIn(user);
  }

  @Post('signup')
  async signUp(@Body() user: CreateUserDto): Promise<{ access_token: string }> {
    return this.authService.singUp(user);
  }
}
