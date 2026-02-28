import express, { Router } from "express";
import cors, { CorsOptions } from 'cors';
import { Server as HttpServer } from 'http';

interface ServerOptions{
    port: number;
    publicPath: string;
    routes: Router;
}

export class Server{
    public readonly app = express();
    private readonly port: number;
    private serverListener?: HttpServer;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(options: ServerOptions){
        const {port, publicPath, routes} = options;
        
        this.port = port;
        this.publicPath = publicPath;
        this.routes = routes;
    };

    async start(){
        
        const corsOptions: CorsOptions = {
            origin: ['http://localhost:5173'],
            methods: ['GET', 'POST', 'PUT'],
            allowedHeaders: ['Authorization', 'Content-Type'],
        };

        this.app.use(cors(corsOptions));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));

        this.app.use(express.static(this.publicPath));
        
        this.app.use(this.routes);

        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server running in port ${this.port}`);
        });
    }

    public close(){
        this.serverListener?.close();
    }


}