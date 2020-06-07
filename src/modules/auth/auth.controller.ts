import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignupDto } from './dto/signup';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin';

@Controller('auth')
export class AuthController {
	constructor(private readonly _authService: AuthService) {}
	@Post('/signup')
	@UsePipes(ValidationPipe)
	async signup(@Body() signupDto: SignupDto): Promise<void> {
		return this._authService.signUp(signupDto);
	}

	@Post('/signin')
	@UsePipes(ValidationPipe)
	async signin(@Body() signinDto: SigninDto): Promise<{ token: string }> {
		return this._authService.signIn(signinDto);
	}
}
