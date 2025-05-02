import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  saltOrRounds: number = 10;

  async singUp(user: CreateUserDto): Promise<{ access_token: string }> {
    const spicePassword = user.password + process.env.PEPPER;
    const hashPass = await bcrypt.hash(spicePassword, this.saltOrRounds);

    const data = { ...user, password: hashPass };

    const newUser = await this.usersService.createUser(data);
    const payload = { sub: newUser.id, username: newUser.name };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
  async logIn(
    user: AuthDto,
  ): Promise<{ access_token: string; email: string; name: string }> {
    const cashierMatched = await this.usersService.findByEmail(user.email);

    if (!cashierMatched)
      throw new NotFoundException('Email or password are wrong');

    const spicePassword = user.password + process.env.PEPPER;

    const isMatch = await bcrypt.compare(
      spicePassword,
      cashierMatched.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Email or password are wrong');
    }

    const payload = { sub: cashierMatched.id, username: cashierMatched.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
      name: cashierMatched.name,
      email: cashierMatched.email,
    };
  }
}
