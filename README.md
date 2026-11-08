# Lab 3: REST API, Query Parameters and Validation

**Name:** Srujana Goud Palem  
**Registration Number:** 252U1R1177  
**Section:** CSE (2-D)

## Objective

To develop and test a REST API using Node.js, Express.js, and SQLite. The project implements CRUD operations, query parameters, input validation, and error handling.

## Technologies Used

- Node.js
- Express.js
- SQLite
- JavaScript
- Postman
- Visual Studio Code

## How to Run

1. Open the project folder in VS Code.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   node app.js
   ```

4. Open the API using:

   `http://localhost:3000/books/`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books/` | Get all books |
| GET | `/books/:bookId/` | Get a single book |
| POST | `/books/` | Add a new book |
| PUT | `/books/:bookId/` | Update a book |
| DELETE | `/books/:bookId/` | Delete a book |

## Query Parameters

| Parameter | Description |
|---|---|
| `search_q` | Search books by title or author |
| `order_by` | Sort by title, author, or price |
| `order` | Sort in ascending or descending order |
| `limit` | Limit the number of results |
| `offset` | Skip a specified number of results |
| `min_price` | Filter books by minimum price |
| `max_price` | Filter books by maximum price |

## Input Validation and Error Handling

- Validates required book title and author.
- Validates price and pages.
- Returns appropriate error responses for invalid input.
- Returns a 404 response when a requested book is not found.
- Uses parameterized SQL queries.

## Screenshots

Add your Lab 3 screenshots in the `LAB_3ABD/SCREENSHOTS/` folder and link them below.

## Screenshots
## Screenshots

All Lab 3 Postman testing screenshots are available in the `LAB_3ABD/SCREENSHOTS/` folder.

### CRUD Operations

**GET All Books**

![Get All Books](LAB_3ABD/SCREENSHOTS/get-all-books.png)

**POST Book**

![POST Book](LAB_3ABD/SCREENSHOTS/post-book.png)

**PUT Book**

![PUT Book](LAB_3ABD/SCREENSHOTS/put-book.png)

**DELETE Book**

![DELETE Book](LAB_3ABD/SCREENSHOTS/delete-book.png)

### Search and Filtering

**Search Books**

![Search Books](LAB_3ABD/SCREENSHOTS/search-books.png)

**Price Range Filter**

![Price Filter](LAB_3ABD/SCREENSHOTS/price-filter.png)

**Limit and Offset**

![Limit and Offset](LAB_3ABD/SCREENSHOTS/limit-offset.png)

### Sorting

**Sort Books by Title (A–Z)**

![Sort by Title](LAB_3ABD/SCREENSHOTS/Sort%20books%20by%20title%20(A%E2%80%93Z).png)

**Sort Books by Author (A–Z)**

![Sort by Author](LAB_3ABD/SCREENSHOTS/Sort%20books%20by%20author%20(A%E2%80%93Z).png)

**Sort Books by Price (Ascending – Lowest to Highest)**

![Sort by Price Ascending](LAB_3ABD/SCREENSHOTS/Sort%20books%20by%20price%20(ascending%20%E2%80%93%20lowest%20to%20highest).png)

**Sort Books by Price (Descending – Highest to Lowest)**

![Sort by Price Descending](LAB_3ABD/SCREENSHOTS/Sort%20books%20by%20price%20(descending%20%E2%80%93%20highest%20to%20lowest).png)

### Validation and Error Handling

**Input Validation Error (400 Bad Request)**

![Validation Error](LAB_3ABD/SCREENSHOTS/validation-error.png)

**Book Not Found (404 Not Found)**

![404 Error](LAB_3ABD/SCREENSHOTS/404-error.png)

## Conclusion

Successfully developed and tested a REST API using Node.js, Express.js, and SQLite. Implemented CRUD operations, query parameters, input validation, and error handling using Postman.
