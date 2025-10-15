# library
📚 Library Server

A Node.js + Express backend for a digital library system.
The server integrates MongoDB (via Mongoose) and MySQL databases to manage books, users, and authentication.

🚀 Features

🔍 Search books by title, genre, author, or other fields

👤 Full authentication and authorization (AAA) system

Register new users

Login / Logout

Token-based access protection (JWT)

🗂️ Integration with two databases:

MongoDB (via Mongoose) — stores book data and genres

MySQL — manages users, accounts, and relations between books and readers

📖 RESTful API design

⚙️ Easy to extend and configure


| Layer          | Technology             |
| -------------- | ---------------------- |
| Server         | Node.js + Express      |
| Database 1     | MongoDB (Mongoose ORM) |
| Database 2     | MySQL                  |
| Authentication | JWT / bcrypt           |
| Environment    | dotenv                 |

```bash
git clone https://github.com/PoPygai/library
cd library-server
npm install
