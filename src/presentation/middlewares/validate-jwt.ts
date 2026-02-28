import { NextFunction, Request, Response } from "express";
import { prisma } from "@data/postgres";
import { JwtAdapter } from "@config/jwt.adapter";
import { CustomError } from "@domain/errors/custom.error";
import { ERROR_MESSAGES } from "@infrastructure/constants";

export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.header('Authorization');

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(401).json({
            success: false,
            error: {message: ERROR_MESSAGES.TOKEN.NO_TOKEN}
        });
        return;
    };

    const token: string | undefined = authHeader.split(' ')[1];

    if(!token){
        res.status(401).json({
            success: false,
            error: {message: ERROR_MESSAGES.TOKEN.NO_TOKEN}
        });
        return;
    };

    try {
        const payload = await JwtAdapter.validateToken(token);
    
        if(!payload){
            res.status(401).json({
                success: false,
                error: {message: ERROR_MESSAGES.TOKEN.INVALID}
            });
            return;
        }

        const user = await prisma.user.findFirst({where: {id: payload.id, deletedAt: null}});
        
        if(!user){
            res.status(401).json({
                success: false,
                error: {message: ERROR_MESSAGES.TOKEN.INVALID_USER}
            });
            return;
        }

        next();

    } catch (error) {
        if(error instanceof CustomError){
            res.status(error.statusCode).json({
                success: false,
                error: {message: error.message}
            });
            return;
        };
        console.log(error);
        res.status(500).json('Internal server error while validating token');
    }

};