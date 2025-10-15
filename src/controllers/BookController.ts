import {LibraryService} from "../service/LibraryService.js";
import {BookDto} from "../model/BookDto.js";
import {Book} from "../model/Book.js";
import {convertBookDtoToBook, convertBookToBookDto, getGenre, getStatus} from "../utils/tools.js";
import {LibraryServiceImplMongo} from "../service/LibraryServiceImplMongo.js";
//import {LibraryServiceImplSQL} from "../service/LibraryServiceImplSQL.js";

export class BookController {
     private libService:LibraryService = new LibraryServiceImplMongo();
   // private libService:LibraryService = new LibraryServiceImplSQL();

    async getAllBooks() {
        return this.libService.getAllBooks();
    }
    async addBook(dto: BookDto) {
        const book: Book = convertBookDtoToBook(dto);
        await this.libService.addBook(book)
        return book;
    }
    async removeBook(id: string) {
        const book = await this.libService.removeBook(id);
        return convertBookToBookDto(book);
    }
    async pickUpBook(id: string, reader: string) {
        await this.libService.pickUpBook(id, reader)
    }
    async returnBook(id: string) {
        await this.libService.returnBook(id)
    }
    async getBooksByGenre(genre: string) {
        const gen = getGenre(genre);
        const filteredBooks = await this.libService.getBooksByGenre(gen)
        return filteredBooks.map(book => convertBookToBookDto(book));
    }
    async getBooksByGenreAndStatus(genre: string, status: string):Promise<Book[]> {
        const gen = getGenre(genre);
        const st = getStatus(status);
        return await this.libService.getBooksByGenreAndStatus(gen, st);
    }
    async getBookById(id: string) {
        return await this.libService.getBookById(id);
    }

    async getReaderByBookTitle(title: string) {
        return await this.libService.getReaderByBookTitle(title);
    }
    async getAllReadersByBookId(id: string) {
        return await this.libService.getAllReadersByBookId(id);
    }
    async getAllBooksByReaderId(readerId: string) {
        const filteredBooks:Book[] = await this.libService.getBooksByReaderId(readerId)
        return filteredBooks.map(book => convertBookToBookDto(book));
    }
}