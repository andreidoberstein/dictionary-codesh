import { UserEntity } from "src/users/entities/user.entity";
import { UpdateUserDto } from "../dto/update-user.dto";

export interface IUsersService {
  findAll(user: any): Promise<UserEntity[]>;
  findOne(id: string, user: any): Promise<UserEntity>;
  update(id: string, dto: UpdateUserDto, user: any): Promise<UserEntity>;
}