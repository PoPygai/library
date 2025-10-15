import {Book, BookGenres} from "../model/Book.js";
import {Reader} from "../model/Reader.js";

export interface LibraryService {
     addBook: (book:Book) => Promise<void> ;
     removeBook:(id:string) => Promise<Book>;
     pickUpBook:(id:string, reader:string) => Promise<void>;
     returnBook:(id:string) => Promise<void>;
     getAllBooks:() => Promise<Book[]>;
     getBooksByGenre:(genre: BookGenres) => Promise<Book[]>;
     getBooksByGenreAndStatus:(gen: string, st: string)=> Promise<Book[]>;
     getBookById:(id: string) => Promise<Book>;
     getReaderByBookTitle:(bookTitle: string) => Promise<string[]>;
     getAllReadersByBookId: (id: string) => Promise<string[]>;
     getBooksByReaderId: (readerId: string) => Promise<Book[]>;
}