import bcrypt from "bcryptjs";

export class BCryptAdapter{

    static hash(password: string): string{
        const salt = bcrypt.genSaltSync();
        return bcrypt.hashSync(password, salt);
    }

    static compare(password: string, hashPassword: string): boolean{
        return bcrypt.compareSync(password, hashPassword);
    }
}