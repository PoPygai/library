// import {LibraryService} from "./LibraryService.js";
// import {Book, BookGenres, BookStatus} from "../model/Book.js";
// import {pool} from "../config/libConfig.js";
// import {Error} from "mongoose";
//
//
// export class LibraryServiceImplSQL implements LibraryService{
//     async addBook(book: Book): Promise<void> {
//         try{
//             await pool.query('INSERT INTO books VALUES(null,?,?,?,?,?)', [book.title, book.author, book.genre, book.status, book.id])
//         }catch(e){
//             throw new Error(JSON.stringify({status: 404, message:"Book already exists"}))
//         }
//     }
//     async getAllBooks(): Promise<Book[]> {
//         const [result] = await pool.query('SELECT * FROM books');
//
//         return Promise.resolve(result as Book[]);
//     }
//     async getBooksByGenre(genre: BookGenres): Promise<Book[]> {
//         const query = 'SELECT * FROM books WHERE genre = ?';
//         const value = [genre]
//         const [result] = await pool.query(query, value);
//         return Promise.resolve(result as Book[]);
//     }
//     async getBooksByGenreAndStatus(gen: string, st: string): Promise<Book[]> {
//         const query = 'SELECT * FROM books WHERE genre = ? AND status = ?';
//         const value = [gen, st]
//         const [result] = await pool.query(query, value);
//         return Promise.resolve(result as Book[]);
//     }
//     async getBookById(id:string):Promise<Book> {
//         const query = 'SELECT * FROM books WHERE book_id = ?';
//         const value = [id]
//         const [result] = await pool.query(query, value);
//         const books = result as Book[];
//
//         async function getPickRecordsByBookId(id: string) {
//             const query = 'SELECT date, name as reader FROM books_readers as b_r JOIN readers as r ON b_r.readerID = r.reader_id WHERE bookID = ?'
//             const [result] = await pool.query(query, [id])
//             return result as {date: string, reader: string}[];
//         }
//
//         if(books.length){
//             let queryedBook = books[0];
//             const pickRecords:{date:string, reader:string}[] = await getPickRecordsByBookId(queryedBook.id)
//             queryedBook.pickList = pickRecords;
//             return Promise.resolve(queryedBook)
//         }
//
//         throw new Error(JSON.stringify({status: 404, message: `Book with id ${id} not found`}))
//     }
//     async pickUpBook(id: string): Promise<void> {
//         const book = await this.getBookById(id);
//         if(book.status!==BookStatus.ON_STOCK)
//             throw new Error(JSON.stringify({status: 400, message: "Wrong book status"}))
//         pool.query('UPDATE books SET status = "on_hand" WHERE book_id = ?', [id])
//     }
//     async removeBook(id: string): Promise<Book> {
//         const book = await this.getBookById(id);
//         book.status = BookStatus.REMOVED;
//        pool.query('DELETE FROM books_readers WHERE bookID = ?', [book.id])
//         pool.query('DELETE FROM books WHERE book_id = ?', [id])
//         return Promise.resolve(book)
//     }
//     async returnBook(id: string, reader: string): Promise<void> {
//         const book = await this.getBookById(id);
//         if(book.status!==BookStatus.ON_HAND)
//             throw new Error(JSON.stringify({status: 400, message: "Wrong book status"}))
//
//         let queriedReader = await this.getReaderByName(reader);
//         if(!book)
//             throw new Error(JSON.stringify({status: 400, message:"Can't return book because this book or reader not exists"}))
//         if(!queriedReader){
//             await pool.query('INSERT INTO readers VALUES (null, ?)',[reader]);
//             queriedReader = await this.getReaderByName(reader);
//         }
//
//             await pool.query('INSERT INTO books_readers(bookID, readerID, date) VALUES(?, ?, ?)',
//                 [book.id,queriedReader.reader_id, new Date().toDateString()]);
//             await pool.query('UPDATE books SET status = "on_stock" WHERE book_id = ?', [id])
//
//     }
//     private getReaderByName = async (reader: string) => {
//         const query = 'SELECT * FROM readers WHERE name = ?'
//         const [result] = await pool.query(query, [reader]);
//         const readersArr = result as { reader_id: number, name: string }[];
//         const [queriedReader] = readersArr;
//         return queriedReader;
//     }
//     async getReaderByBookTitle(title: string): Promise<string[]>{
//         const [rows] = await pool.query('SELECT * FROM books WHERE title = ?', [title])
//         if(!rows[0].book_id)throw new Error(JSON.stringify({status:404, message:`Book with title ${title} not found`}))
//         if(rows[0].status !== BookStatus.ON_HAND)throw new Error(JSON.stringify({status: 404, message: "Book not in hand"}))
//
//         const query = `SELECT r.*  FROM readers r JOIN books_readers br ON r.reader_id = br.readerID WHERE br.bookID = ?`;
//         const [result] = await pool.query(query, [rows[0].book_id]);
//
//         return Promise.resolve(result);
//     }
//
//     async getAllReadersByBookId(id: string): Promise<string[]> {
//         const [rows] = await pool.query('SELECT * FROM books WHERE book_id = ?', [id])
//         if(!rows[0].book_id)throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
//         if(rows[0].status !== BookStatus.ON_HAND)throw new Error(JSON.stringify({status: 404, message: "Book not in hand"}))
//
//         const query = `SELECT r.*  FROM readers r JOIN books_readers br ON r.reader_id = br.readerID WHERE br.bookID = ?`;
//         const [result] = await pool.query(query, [rows[0].book_id]);
//
//         return Promise.resolve(result);
//     }
//     async getBooksByReaderId(readerId: string): Promise<Book[]> {
//         const [rows] = await pool.query('SELECT * FROM readers WHERE id = ?', [readerId])
//         if(!rows[0].reader_id)throw new Error(JSON.stringify({status: 404, message: `Reader with id ${readerId} not found`}))
//         const query = `SELECT b.*  FROM books b JOIN books_readers br ON b.book_id = br.bookID WHERE br.readerID = ?`;
//         const [result] = await pool.query(query, [rows[0].readerId]);
//
//         return Promise.resolve(result);
//     }
// }

