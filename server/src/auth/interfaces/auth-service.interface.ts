import { LoginDto } from '../dto/signin.dto';
import { RegisterDto } from '../dto/signup.dto';
import { AuthEntity } from '../entities/auth.entity';

export interface IAuthService {
  register(dto: RegisterDto): Promise<AuthEntity>;
  login(dto: LoginDto): Promise<AuthEntity>;
}
