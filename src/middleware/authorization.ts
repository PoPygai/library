import {AuthRequest, Role} from "../utils/libTypes.js";
import {NextFunction, Response} from "express";
import {normalizePath} from "../utils/tools.js";
import {configuration} from "../config/libConfig.js";

export const authorize = (arr:Record<string, Role[]>) =>
    (req: AuthRequest, res:Response, next: NextFunction) => {
    const pathMethod = req.method + normalizePath(req.path);
    const roles = req.roles;
    if(roles && roles.some(item => arr[pathMethod].includes(item)))
        next();
    else throw new Error(JSON.stringify({status: 403, message:"Reqired another role"}))
    }

export const userReqNumberCheck = (timeWindow: number, lim: number) =>
    (req: AuthRequest, res:Response, next: NextFunction) => {
        const roles = req.roles;
        const user = req.username;
        let count = configuration.userRequestMap.get(user!)
        if(count && count.length >= lim && roles && roles.length === 1 && roles[0] === Role.USER)
            throw new Error(JSON.stringify({status: 403, message: "Too many requests"}));
        else{
            if(req.roles &&req.roles.length===1 && req.roles[0] === Role.USER){
                if(!count) {
                    configuration.userRequestMap.set(req.username!, [Date.now()]);
                }
                else {
                    if((Date.now() - count[0])/1000 > timeWindow)
                        count = [Date.now()] ;
                    else
                        count.push(Date.now());
                }
            }
            next();
        }

    }