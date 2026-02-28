import { AxiosRequestConfig } from "axios";

export interface HttpClient {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}