import mysql, {Pool} from 'mysql2/promise'
import dotenv from 'dotenv'
import {AccountServiceImplMongo} from "../service/AccountServiceImplMongo.js";
import {AccountService} from "../service/AccountService.js";
import app_config from '../../config/app-library-config.json'

export interface AppConfig {
    port: number,
    skipPaths: string[],
    pathsRoles: Record<string, string[]>,
    time_window_sec: number,
    request_limit: number,
    pool: Pool,
    accService:AccountService,
    userRequestMap: Map<string, number[]>
    jwt:{
        secret:string,
        exp: string,
    }
}
dotenv.config();
//========================================
export const configuration:AppConfig = {
    ...app_config,
    pool: mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT? +process.env.DB_PORT : undefined,
        database: process.env.DB_NAME,
        user:process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }),
    accService:new AccountServiceImplMongo(),
    userRequestMap:new Map<string, number[]>,
    jwt:{
        secret:process.env.JWT_SECRET || "super-secret-key",
        exp: process.env.JWT_EXP || 'h1',
    }
}
