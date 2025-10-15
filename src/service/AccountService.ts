import {Reader} from "../model/Reader.js";
import {Role} from "../utils/libTypes.js";

export interface AccountService {
    addAccount: (reader:Reader) => Promise<void>;
    getAccount: (userName:string) => Promise<Reader>;
    updateAccount:(reader:Reader) => Promise<void>;
    removeAccount:(userName:string) => Promise<Reader>;
    updateRoles: (userName: string, roles: Role[]) => Promise<Reader>;
    login: (body: { userName: string; password: string })=> Promise<string>;
}