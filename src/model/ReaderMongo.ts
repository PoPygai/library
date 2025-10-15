import mongoose from "mongoose";
import {Reader} from "./Reader.js";
import {Role} from "../utils/libTypes.js";

export const ReaderMongoSchema = new mongoose.Schema<Reader>({
    readerId:{type:String, required: true},
    email:{type:String, required: true},
    passHash:{type:String, required: true},
    birthdate:{type:String, required: true},
    roles:{type:[String], enum: Role, required: true}
}, {versionKey:false});

export const ReaderModel = mongoose.model<Reader>('Reader', ReaderMongoSchema, 'readers_collection')