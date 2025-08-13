import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/signin.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<import("../entities/auth.entity").AuthEntity>;
    login(dto: LoginDto): Promise<import("../entities/auth.entity").AuthEntity>;
}
