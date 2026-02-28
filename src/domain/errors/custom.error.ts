import {Response} from 'express';

export class CustomError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly message: string
    ) {
        super(message);
    }

    static badRequest(message: string) {
        return new CustomError(400, message);
    }

    static unauthorized(message: string) {
        return new CustomError(401, message);
    }

    static forbidden(message: string) {
        return new CustomError(403, message);
    }

    static notFound(message: string) {
        return new CustomError(404, message);
    }

    static internalServer(message: string) {
        return new CustomError(500, message);
    }

    static handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({
                success: false,
                error: {message: error.message},
            });
            return;
        }

        console.log(`${error}`);
        res.status(500).json({error: {message: 'Internal server error'}});
    }
}
