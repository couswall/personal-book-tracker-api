import { DTOS_ERRORS } from "@domain/constants/user.constants";

export class GetUserByIdDto{
    constructor(
        public readonly id: number,
    ) {};

    static create(id?: number): [string?, GetUserByIdDto?]{
        
        if(!id) return [DTOS_ERRORS.GET_BY_ID.REQUIRED];
        if(typeof id !== 'number') return [DTOS_ERRORS.GET_BY_ID.NUMBER];

        return[undefined, new GetUserByIdDto(id)];
    };
}