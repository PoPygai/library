import {Role} from "../utils/libTypes.js";

export type Reader = {
    readerId: string,
    passHash: string,
    email: string,
    birthdate: string,
    roles: Role[]
}
