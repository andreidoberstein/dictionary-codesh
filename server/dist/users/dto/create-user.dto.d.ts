export declare enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}
export declare class CreateUserDto {
    name: string;
    email: string;
    role: Role;
}
