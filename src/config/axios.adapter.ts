import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { HttpClient } from "@config/interfaces";

export class AxiosAdapter implements HttpClient{
    private readonly instance: AxiosInstance;

    constructor(config?: AxiosRequestConfig) {
        this.instance = axios.create(config);
    };

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T>{
        const response: AxiosResponse<T> = await this.instance.get(url, config);
        return response.data;
    }
}