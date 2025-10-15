import {BookDto} from "../model/BookDto.js";
import {Book, BookGenres, BookStatus} from "../model/Book.js";
import {v4 as uuidv4} from 'uuid';
import {ReaderDto} from "../model/ReaderDto.js";
import bcrypt from "bcryptjs";
import {Reader} from "../model/Reader.js";
import {Role} from "./libTypes.js";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import {configuration} from "../config/libConfig.js";

dotenv.config();
export function getGenre(genre: string) {
    const bookGenre =
        Object.values(BookGenres).find(v => v === genre)
    if(!bookGenre) throw new Error (JSON.stringify({status: 400, message: "Wrong genre"}))
    return bookGenre;
}

export const getStatus = (status:string)=> {
    const bookSt =
        Object.values(BookStatus).find(v => v === status)
    if(!bookSt) throw new Error (JSON.stringify({status: 400, message: "Wrong genre"}))
    return bookSt;
}

export const convertBookDtoToBook = (dto: BookDto):Book => {
    return{
        id: uuidv4(),
        author: dto.author,
        title: dto.title,
        status: BookStatus.ON_STOCK,
        genre: getGenre(dto.genre),
        pickList: []
    }
}

export const convertBookToBookDto = (book:Book):BookDto => {
    return {
        title: book.title,
        author: book.author,
        genre: book.genre
    }
}

export function convertReaderDtoToReader(dto: ReaderDto):Reader {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(dto.password, salt);
    return {
        readerId: dto.userName,
        birthdate: dto.birthdate,
        email: dto.email,
        passHash: hash,
        roles: [Role.USER]
    }
}

export const convertReaderToReaderDto = (reader:Reader):ReaderDto => {
    return {
         userName: reader.readerId,
         email: reader.email,
        password: reader.passHash,
        birthdate: reader.birthdate,

    }
}

export const normalizePath = (path:string) => {
    if(path.startsWith('/accounts/account')) return '/accounts/account';
    if(path.startsWith('api/books/book')) return 'api/books/book';
    return path;
}

export const getJWT = (userName:string, roles:Role[]) => {
    const payload = {roles:JSON.stringify(roles)}
    const secretKey = configuration.jwt.secret
    const options = {
        expiresIn: configuration.jwt.exp as any,
        subject: userName,
    }
    const token = jwt.sign(payload,secretKey,options);
    return token;
}