import {AxiosRequestConfig} from 'axios';

export interface HttpClient {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export interface Logger {
    error(message: string, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>): void;
    info(message: string, context?: Record<string, unknown>): void;
    debug(message: string, context?: Record<string, unknown>): void;
    fatal(message: string, context?: Record<string, unknown>): void;
}
