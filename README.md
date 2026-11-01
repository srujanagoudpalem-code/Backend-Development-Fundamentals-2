# Lab 2: SQLite Database and CRUD Routes

**Name:** Srujana  
**Registration Number:252U1R1177  
**Section:CSE(2-D)

## Live Link
Not deployed. The project runs locally using Node.js and Express.

## Objective
To connect an Express server with a SQLite database and perform CRUD operations through HTTP routes.

## Technologies Used
- Node.js
- Express.js
- SQLite
- JavaScript
- Postman
- VS Code

## How to Run

1. Open the project folder in VS Code.
2. Install dependencies:

   `npm install`

3. Start the server:

   `npx nodemon app.js`

4. Server URL: `http://localhost:3000/`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /books/ | Get all books |
| GET | /books/:bookId/ | Get one book |
| POST | /books/ | Add a new book |
| PUT | /books/:bookId/ | Update a book |
| DELETE | /books/:bookId/ | Delete a book |

## Screenshots

### GET All Books
![GET All Books](screenshots/get-all-books.png)

### GET Single Book
![GET Single Book](screenshots/get-single-book.png)

### POST Book
![POST Book](screenshots/post-book.png)

### PUT Book
![PUT Book](screenshots/put-book.png)

### DELETE Book
![DELETE Book](screenshots/delete-book.png)

## Notes
Successfully created a SQLite database and connected it to an Express server. Implemented and tested all five CRUD operations using Postman.

Parameterized SQL queries were used to prevent SQL injection
