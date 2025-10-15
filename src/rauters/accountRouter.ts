import express, {Request, Response} from "express";
import asyncHandler from "express-async-handler";
import {loginSchema, readerAccountSchema, rolesArrSchema} from "../utils/joiSchemas.js";
import {AccountController} from "../controllers/AccountController.js";
import {ReaderDto} from "../model/ReaderDto.js";
import {AuthRequest, Role} from "../utils/libTypes.js";
import {Reader} from "../model/Reader.js";

export const  accountRouter = express.Router();
const controller = new AccountController();

accountRouter.post('/', asyncHandler(async (req:Request, res:Response) => {
    const body = req.body;
    const {error} = readerAccountSchema.validate(body);
    if(error) throw new Error(JSON.stringify({
        status: 400, message: error.message
    }));
    const result = await controller.addReaderAccount(body as ReaderDto);
    res.status(200).json(result);
}));
accountRouter.get('/account/:username', asyncHandler(async (req:AuthRequest, res) => {
    const reader_dto = await controller.getReaderAccount(req.params.username as string);
   res.status(200).json(reader_dto)
}));
accountRouter.delete('/account/:username', asyncHandler(async (req, res) => {
    const reader = await controller.removeReaderAccount(req.params.username as string);
    res.status(200).json(reader)
}))
accountRouter.put('/', asyncHandler(async (req, res) => {
    const body = req.body;
    const {error} = readerAccountSchema.validate(body);
    if (error) throw new Error(JSON.stringify({
        status: 400, message: error.message
    }));
    const result = await controller.updateReaderAccount(body as ReaderDto);
    res.status(200).send(result);
}))
accountRouter.put('/roles', asyncHandler(async (req: AuthRequest, res:Response) => {
    const {userName} = req.query;
    const body = req.body;
    const{error} = rolesArrSchema.validate(body)
    if(error) throw new Error(JSON.stringify({status: 400, message:error.message}) );

    const result:Reader = await controller.updateRoles(userName as string, body as Role[])
    res.status(200).json(result)
}))
accountRouter.post('/login', asyncHandler(async (req: AuthRequest, res:Response) => {
    const body = req.body;
    const{error} = loginSchema.validate(body)
    if(error) throw new Error(JSON.stringify({status: 400, message:error.message}));
    const result = await controller.login(body as {userName:string, password:string})
    res.status(200).json(result);
}))