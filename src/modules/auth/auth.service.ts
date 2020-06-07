import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup';
import { SigninDto } from './dto/signin';
import { compare } from 'bcryptjs';
import { IJwtPayload } from './jwt-payload.interface';
import { RoleType } from '../role/roletype.enum';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(AuthRepository) private readonly _authReposirity: AuthRepository,
		private readonly _jwtService: JwtService
	) {}

	async signUp(signUpDto: SignupDto): Promise<void> {
		const { username, email } = signUpDto;
		const userExists = await this._authReposirity.findOne({
			where: [ { username }, { email } ]
		});
		if (userExists) {
			throw new ConflictException('username or email already exists');
		}
		return this._authReposirity.signup(signUpDto);
	}

	async signIn(signInDto: SigninDto): Promise<{ token: string }> {
		const { username, password } = signInDto;
		const user = await this._authReposirity.findOne({
			where: { username }
		});
		if (!user) {
			throw new NotFoundException('user does not exists');
		}
		const isMatch = await compare(password, user.password);
		if (!isMatch) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload: IJwtPayload = {
			id: user.id,
			email: user.email,
			username: user.username,
			roles: user.roles.map((r) => r.name as RoleType)
		};
		const token = this._jwtService.sign(payload);
		return { token };
	}
}
