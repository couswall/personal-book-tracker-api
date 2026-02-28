export interface ICreateUserEntity{
    id: number;
    fullName: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export interface ICreateUserDto{
    fullName: string;
    username: string;
    email: string;
    password: string;
}

export interface ILoginUserDto{
    emailOrUsername: string;
    password: string;
}