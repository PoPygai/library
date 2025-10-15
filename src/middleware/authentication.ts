import {AccountService} from "../service/AccountService.js";
import {Request, Response, NextFunction} from "express";
import bcrypt from "bcryptjs";
import {AuthRequest, Role} from "../utils/libTypes.js";
import {configuration} from "../config/libConfig.js";
import jwt, {JwtPayload} from "jsonwebtoken";
const BASIC = "Basic ";
const BEARER = "Bearer ";
async function basicAuth(header: string, req: AuthRequest, service: AccountService) {
    const authToken = Buffer.from(header.substring(BASIC.length), 'base64').toString('ascii');
    console.log(authToken);
    const [username, password] = authToken.split(":")
    if(username === process.env.OWNER && password === process.env.OWNER_PASS) {
        req.username = "GOD";
        req.roles = [Role.ROOT_ADMIN];
    } else
        try {
        const account = await service.getAccount(username);
        if(bcrypt.compareSync(password,account.passHash)){
            req.username = username;
            req.roles = account.roles;
            console.log("reader authenticated")
        }
    } catch (e) {
        console.log("reader not authenticated")
    }

}

async function jwtAuth(header: string, req: AuthRequest, service: AccountService) {
    const token= header.substring(BEARER.length);
    try {
        const payload = jwt.verify(token, configuration.jwt.secret) as JwtPayload;
        req.username = payload.sub;
        req.roles = JSON.parse(payload.roles);
    } catch (e) {
        console.log("reader not authenticated by JWT")
    }
}

export const authenticate = (service:AccountService) =>
async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header('Authorization');
    console.log(header);
    if (header) {
        if(header.startsWith(BASIC))
            await basicAuth(header, req, service)
        else if (header!.startsWith(BEARER)) await jwtAuth(header, req, service)
    }
    next();
}

export const skipRoutes = (skipRoutes:string[]) =>
    (req:AuthRequest, res:Response,next:NextFunction) => {
    const pathMethod = req.method + req.path;
        console.log(pathMethod)
    if(!skipRoutes.includes(pathMethod) && !req.username)
        throw new Error(JSON.stringify({status:401, message:"Go and login!"}))
    else next();
}