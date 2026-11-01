const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
app.use(express.json());

let db;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: "./books.db",
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        price INTEGER,
        pages INTEGER
      )
    `);

    const count = await db.get(
      "SELECT COUNT(*) AS count FROM book"
    );

    if (count.count === 0) {
      await db.run(`
        INSERT INTO book (title, author, price, pages)
        VALUES
        ('Wings of Fire', 'APJ Abdul Kalam', 250, 180),
        ('The Alchemist', 'Paulo Coelho', 300, 200),
        ('Atomic Habits', 'James Clear', 400, 250),
        ('Ikigai', 'Hector Garcia', 280, 190)
      `);
    }

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.log(error.message);
  }
};

// GET all books
app.get("/books/", async (req, res) => {
  const books = await db.all("SELECT * FROM book");
  res.status(200).send(books);
});

// GET one book
app.get("/books/:bookId/", async (req, res) => {
  const book = await db.get(
    "SELECT * FROM book WHERE id = ?",
    [req.params.bookId]
  );

  if (!book) return res.status(404).send("Book not found");
  res.status(200).send(book);
});

// POST a book
app.post("/books/", async (req, res) => {
  const { title, author, price, pages } = req.body;

  const result = await db.run(
    `INSERT INTO book (title, author, price, pages)
     VALUES (?, ?, ?, ?)`,
    [title, author, price, pages]
  );

  res.status(201).send({
    message: "Book added successfully",
    bookId: result.lastID,
  });
});

// PUT a book
app.put("/books/:bookId/", async (req, res) => {
  const { title, author, price, pages } = req.body;

  const result = await db.run(
    `UPDATE book
     SET title = ?, author = ?, price = ?, pages = ?
     WHERE id = ?`,
    [title, author, price, pages, req.params.bookId]
  );

  if (result.changes === 0) {
    return res.status(404).send("Book not found");
  }

  res.status(200).send("Book updated successfully");
});

// DELETE a book
app.delete("/books/:bookId/", async (req, res) => {
  const result = await db.run(
    "DELETE FROM book WHERE id = ?",
    [req.params.bookId]
  );

  if (result.changes === 0) {
    return res.status(404).send("Book not found");
  }

  res.status(200).send("Book deleted successfully");
});

initializeDBAndServer();