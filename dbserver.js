const express = require("express");
const app = express();
const mysql = require("mysql");
const bcrypt = require("bcrypt");

const bodyParser = require('body-parser');

require("dotenv").config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

const db = mysql.createPool({
  connectionLimit: 100,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
});

db.getConnection((err, connection) => {
  if (err) throw err;
  console.log("DB connected successful: " + connection.threadId);
});

const port = process.env.PORT;

app.listen(port, () => console.log(`Server Started on port ${port}...`));
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// CREATE USER
app.post("/createUser", async (req, res) => {
console.log(req.body);
  const { name, email, password, confirmPassword} = req.body; // Destructure body parameters
  
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.getConnection(async (err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      res.status(500).send('Error creating user');
      return;
    }

    // Check if username or email already exists
    const sqlSearch = 'SELECT * FROM userTable WHERE user = ? OR email = ?';
    const searchQuery = mysql.format(sqlSearch, [name, email]);
    await connection.query(searchQuery, async (err, result) => {
      if (err) {
        console.error('Error searching for user:', err);
        res.status(500).send('Error creating user');
        return;
      }

      if (result.length > 0) {
        const isUsernameDuplicate = result.some(user => user.user === name);
        const isEmailDuplicate = result.some(user => user.email === email);

        if (isUsernameDuplicate) {
          connection.release();
          res.status(409).send('Username already exists');
          return;
        }

        if (isEmailDuplicate) {
          connection.release();
          res.status(409).send('Email already exists');
          return;
        }
      }

      // Create user with hashed password
      const sqlInsert = 'INSERT INTO userTable VALUES (0, ?, ?, ?)';
      const insertQuery = mysql.format(sqlInsert, [name, email, hashedPassword]);
      await connection.query(insertQuery, (err, result) => {
        connection.release();
        if (err) {
          console.error('Error creating user:', err);
          res.status(500).send('Error creating user');
          return;
        }

        res.status(201).send('User created successfully!');
      });
    });
  });
});

// LOGIN (AUTHENTICATE USER)
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.getConnection(async (err, connection) => {
    if (err) throw err;

    const sqlSearch = "Select * from userTable where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);

    await connection.query(search_query, async (err, result) => {
      connection.release();

      if (err) throw err;

      if (result.length === 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        const hashedPassword = result[0].password; // Get the hashedPassword

        if (await bcrypt.compare(password, hashedPassword)) {
          console.log("---------> Login Successful");
          res.send(`${email} is logged in!`);
        } else {
          console.log("---------> Password Incorrect");
          res.send("Password incorrect!");
        }
      }
    });
  });
});

// Address this missing closing curly brace
