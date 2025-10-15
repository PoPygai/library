import {ReaderDto} from "../model/ReaderDto.js";
import {Reader} from "../model/Reader.js";
import {convertReaderDtoToReader, convertReaderToReaderDto} from "../utils/tools.js";
import {AccountService} from "../service/AccountService.js";
import {configuration} from "../config/libConfig.js";
import {Role} from "../utils/libTypes.js";



export class AccountController {
    private service:AccountService = configuration.accService;

    async addReaderAccount(dto: ReaderDto) {
    const reader:Reader = convertReaderDtoToReader(dto);
    await this.service.addAccount(reader);
    return reader;
    }
    async getReaderAccount(username: string) {
       const reader = await this.service.getAccount(username);
        return convertReaderToReaderDto(reader)
    }
    async removeReaderAccount(username: string) {
        const reader = await this.service.removeAccount(username)
        return reader
    }
    async updateReaderAccount(dto: ReaderDto) {
        const reader:Reader = convertReaderDtoToReader(dto);
        await this.service.updateAccount(reader);
        return reader;
    }
    async updateRoles(userName: string, roles: Role[]) {
        return await  this.service.updateRoles(userName, roles);
    }
    async login(body: {userName: string; password: string}) {
        return await this.service.login(body)
    }
}