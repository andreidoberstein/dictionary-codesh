import { UsersService } from '../services/user.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(req: any): Promise<import("../entities/user.entity").UserEntity[]>;
    findOne(id: string, req: any): Promise<import("../entities/user.entity").UserEntity>;
}
