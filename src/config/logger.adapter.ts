import {pino, Logger as PinoLogger, LoggerOptions} from 'pino';
import {Logger} from '@config/interfaces';

export class PinoLoggerAdapter implements Logger {
    private readonly instance: PinoLogger;

    constructor(options?: LoggerOptions) {
        this.instance = pino(options);
    }

    error(message: string, context?: Record<string, unknown>): void {
        this.instance.error(context ?? {}, message);
    }

    warn(message: string, context?: Record<string, unknown>): void {
        this.instance.warn(context ?? {}, message);
    }

    info(message: string, context?: Record<string, unknown>): void {
        this.instance.info(context ?? {}, message);
    }

    debug(message: string, context?: Record<string, unknown>): void {
        this.instance.debug(context ?? {}, message);
    }
}
