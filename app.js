const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();
app.use(express.json());

let db;

// Initialize database and server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: path.join(__dirname, "books.db"),
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

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

// GET all books with search, sorting and filters
app.get("/books", async (req, res) => {
  try {
    const {
      search_q = "",
      order_by = "title",
      order = "ASC",
      limit = "10",
      offset = "0",
      min_price,
      max_price,
    } = req.query;

    const allowedColumns = ["title", "author", "price"];

    if (!allowedColumns.includes(order_by)) {
      return res.status(400).json({
        message: "Invalid order_by value",
      });
    }

    if (!["ASC", "DESC"].includes(order.toUpperCase())) {
      return res.status(400).json({
        message: "Order must be ASC or DESC",
      });
    }

    const limitNumber = Number(limit);
    const offsetNumber = Number(offset);

    if (
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100 ||
      !Number.isInteger(offsetNumber) ||
      offsetNumber < 0
    ) {
      return res.status(400).json({
        message: "Invalid limit or offset",
      });
    }

    const conditions = [];
    const values = [];

    if (search_q.trim() !== "") {
      conditions.push("title LIKE ?");
      values.push(`%${search_q}%`);
    }

    if (min_price !== undefined) {
      if (min_price.trim() === "" || !Number.isFinite(Number(min_price))) {
        return res.status(400).json({
          message: "Invalid minimum price",
        });
      }
      conditions.push("price >= ?");
      values.push(Number(min_price));
    }

    if (max_price !== undefined) {
      if (max_price.trim() === "" || !Number.isFinite(Number(max_price))) {
        return res.status(400).json({
          message: "Invalid maximum price",
        });
      }
      conditions.push("price <= ?");
      values.push(Number(max_price));
    }

    if (
      min_price !== undefined &&
      max_price !== undefined &&
      Number(min_price) > Number(max_price)
    ) {
      return res.status(400).json({
        message: "Minimum price cannot exceed maximum price",
      });
    }

    let sql = "SELECT * FROM book";

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += ` ORDER BY ${order_by} ${order.toUpperCase()} LIMIT ? OFFSET ?`;

    values.push(limitNumber, offsetNumber);

    const books = await db.all(sql, values);

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// GET one book
app.get("/books/:bookId", async (req, res) => {
  try {
    const bookId = Number(req.params.bookId);

    if (!Number.isInteger(bookId) || bookId < 1) {
      return res.status(400).json({
        message: "Invalid book ID",
      });
    }

    const book = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [bookId]
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// POST a new book
app.post("/books", async (req, res) => {
  try {
    const { title, author, price, pages = 0 } = req.body;

    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof author !== "string" ||
      author.trim() === "" ||
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price))
    ) {
      return res.status(400).json({
        message: "Title, author and numeric price are required",
      });
    }

    if (!Number.isInteger(Number(pages)) || Number(pages) < 0) {
      return res.status(400).json({
        message: "Pages must be a non-negative integer",
      });
    }

    const result = await db.run(
      `INSERT INTO book (title, author, price, pages)
       VALUES (?, ?, ?, ?)`,
      [title.trim(), author.trim(), Number(price), Number(pages)]
    );

    res.status(201).json({
      message: "Book added successfully",
      bookId: result.lastID,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// PUT update a book
app.put("/books/:bookId", async (req, res) => {
  try {
    const bookId = Number(req.params.bookId);
    const { title, author, price, pages } = req.body;

    if (!Number.isInteger(bookId) || bookId < 1) {
      return res.status(400).json({
        message: "Invalid book ID",
      });
    }

    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof author !== "string" ||
      author.trim() === "" ||
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price)) ||
      (pages !== undefined &&
        (!Number.isInteger(Number(pages)) || Number(pages) < 0))
    ) {
      return res.status(400).json({
        message: "Provide valid title, author, price and pages",
      });
    }

    const result = await db.run(
      `UPDATE book
       SET title = ?, author = ?, price = ?, pages = ?
       WHERE id = ?`,
      [
        title.trim(),
        author.trim(),
        Number(price),
        pages === undefined ? 0 : Number(pages),
        bookId,
      ]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// DELETE a book
app.delete("/books/:bookId", async (req, res) => {
  try {
    const bookId = Number(req.params.bookId);

    if (!Number.isInteger(bookId) || bookId < 1) {
      return res.status(400).json({
        message: "Invalid book ID",
      });
    }

    const result = await db.run(
      "DELETE FROM book WHERE id = ?",
      [bookId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

initializeDBAndServer();