import { ICreateUserEntity } from "@domain/interfaces/user.interfaces";
import {NoteEntity, ReviewEntity} from '@domain/entities/index';

export class UserEntity{
    constructor(
        public id: number,
        public fullName: string,
        public username: string,
        public email: string,
        public password: string,
        public createdAt: Date,
        public updatedAt: Date | null,
        public deletedAt: Date | null,
        public reviews: ReviewEntity[] = [],
        public notes: NoteEntity[] = [],

    ){};

    public static fromObject(userObject: ICreateUserEntity): UserEntity{
        return new UserEntity(
            userObject.id,
            userObject.fullName,
            userObject.username,
            userObject.email,
            userObject.password,
            userObject.createdAt,
            userObject.updatedAt,
            userObject.deletedAt,
        );
    };
}