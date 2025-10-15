import {LibraryService} from "./LibraryService.js";
import {Book, BookGenres, BookStatus} from "../model/Book.js";
import {Error} from "mongoose";
import {BookModel} from "../model/BookMongo.js";
import {ReaderModel} from "../model/ReaderMongo.js";


export class LibraryServiceImplMongo implements LibraryService{
    async addBook(book: Book): Promise<void> {
        const isExists = await BookModel.findOne({id: book.id})
        if(isExists) throw new Error(JSON.stringify({status: 400,message: 'Book already exist'}));
        const bookDoc = new BookModel(book);
        await bookDoc.save();
    }
    async getAllBooks(): Promise<Book[]> {
        return Promise.resolve( await BookModel.find({}));
    }
    async getBooksByGenre(genre: BookGenres): Promise<Book[]> {
        return Promise.resolve(await BookModel.find({genre}));
    }
    async pickUpBook(id: string, readerId:string): Promise<void> {
        const book = await BookModel.findOne({id});
        if(!book) throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
        if(book.status !== BookStatus.ON_STOCK)
            throw new Error(JSON.stringify({status:403, message: `Book with id ${id} is removed or already on hand`}));
        const reader = await ReaderModel.findOne({readerId});
        if(!reader) throw new Error(JSON.stringify({status:404, message:`Reader ${readerId} not found`}));

        book.status = BookStatus.ON_HAND;
        book.pickList.push({reader:readerId, date: new Date().toDateString(), returnDate: null})
        book.save();
    }
    async removeBook(id: string): Promise<Book> {
        const book = await BookModel.findOneAndDelete({id});
        if(!book) throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
        return book as Book
    }
    async returnBook(id: string): Promise<void> {
        const book = await BookModel.findOne({id});
        if(!book)
            throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
        if(book.status !== BookStatus.ON_HAND)
            throw new Error(JSON.stringify({status:403, message: `Book with id ${id} is on stock or removed. Check your book ID`}))
        book.status = BookStatus.ON_STOCK;
        const pickRecord = book.pickList.pop();
        book.pickList.push({reader:pickRecord?.reader, date: pickRecord?.date, returnDate:new Date().toDateString()});
        book.save();
    }
    async getBooksByGenreAndStatus(gen: string, st: string): Promise<Book[]> {
        return BookModel.find({genre: gen, status: st})
    }
    async getBookById(id: string): Promise<Book> {
        const result = await BookModel.findOne({id});
        if(!result) throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}));
        return Promise.resolve(result as Book);
    }
    async getReaderByBookTitle(title: string): Promise<string[]> {
        const books = await BookModel.find<Book>({title});

        const readers:string[] = books.filter(book => book.status === BookStatus.ON_HAND)
            .map(book => book.pickList[book.pickList.length-1].reader);

        return readers;
    }
    async getAllReadersByBookId(id: string): Promise<string[]> {
        const book = await BookModel.findOne<Book>({id});
        if(!book)
            throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
        const readers: string[] = book.pickList.map(rec => rec.reader);
        return readers;
    }
    async getBooksByReaderId(readerId: string): Promise<Book[]> {
        const filteredBooks: Book[] = await BookModel.find({pickList: {$elemMatch: {reader: readerId}}})
        return Promise.resolve(filteredBooks);
    }

}
