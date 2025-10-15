import {AccountService} from "./AccountService.js";
import {Reader} from "../model/Reader.js";
import {ReaderModel} from "../model/ReaderMongo.js";
import {Error} from "mongoose";
import {Role} from "../utils/libTypes.js";
import bcrypt from "bcryptjs";
import {getJWT} from "../utils/tools.js";



export class AccountServiceImplMongo implements AccountService{

    async addAccount(reader: Reader): Promise<void> {
        const temp = await ReaderModel.findOne({readerId: reader.readerId});

        if(temp) throw new Error(JSON.stringify({status: 404, message: `User ${reader.readerId} already exists`}))
            const readerDoc = new ReaderModel(reader);
            await readerDoc.save();
        }
    async getAccount(userName: string): Promise<Reader> {
        const reader = await ReaderModel.findOne({readerId: userName});
        if(!reader) throw new Error(JSON.stringify({status: 404, message: `User ${userName} not found`}))
        return Promise.resolve(reader);
    }
    async removeAccount(userName: string): Promise<Reader> {
        const reader = await ReaderModel.findOneAndDelete({readerId: userName});
        if (!reader) throw new Error(JSON.stringify({status: 404, message: `Reader ${userName} not found`}))
        return reader as Reader
    }
    async updateAccount(reader: Reader): Promise<void> {
       const result = await ReaderModel.updateOne({readerId:reader.readerId}, reader)
        if(!result.modifiedCount) throw new Error(JSON.stringify({status: 404, message: `Reader ${reader.readerId} not found`}))
    }
    async updateRoles(userName: string, body: Role[]): Promise<Reader> {
        const roles = body;
        const reader = await ReaderModel.findOneAndUpdate({readerId: userName}, {$set: {roles}},{new:true})
        if(!reader) throw new Error(JSON.stringify({status: 404, message: `Reader ${userName} not found`}))
        return reader as Reader;
    }
    async login(body: { userName: string; password: string }): Promise<string> {
        const profile = await this.getAccount(body.userName);
        if(!profile) throw new Error(JSON.stringify({status: 404, message: `User ${body.userName} not found`}))
        if(!bcrypt.compareSync(body.password, profile.passHash))
            throw new Error(JSON.stringify({status:401, message: "Incorrect login or password"}))
       const token = getJWT(body.userName, profile.roles)
        return Promise.resolve(token);
    }
}