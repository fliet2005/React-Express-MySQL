const express = require("express");
const mysql = require("mysql");
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
console.log("NODE_ENV: ", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  // Return the main index.html, so react-router render the route in the client
  app.get("/", (req, res) => {
    res.sendFile(path.resolve("client/build", "index.html"));
  });
}

// MySql DB connection info
const host = "localhost";
const user = "oyao";
const pswd = "$kittles09";
const dbname = "test"; // or original db schema: books, but we can use db: test too

// config db ====================================
const pool = mysql.createPool({
  host: host,
  user: user,
  password: pswd,
  port: "3306",
  database: dbname,
});

const COLUMNS = ["last_name", "first_name"];

app.get("/api/test", (req, res) => {
  // original db name is: books, but we can use db: test too
  const firstName = req.query.firstName;

  if (!firstName) {
    res.json({
      error: "Missing required parameters",
    });
    return;
  }

  let queryString = ``;
  if (firstName == "*") {
    queryString = `SELECT * from authors`;
  } else {
    queryString = `SELECT * from authors WHERE first_name REGEXP '^${firstName}'`;
  }

  pool.query(queryString, function (err, rows, fields) {
    if (err) throw err;

    if (rows.length > 0) {
      res.json(
        rows.map((entry) => {
          const e = {};
          COLUMNS.forEach((c) => {
            e[c] = entry[c];
          });
          return e;
        })
      );
    } else {
      res.json([]);
    }
  });
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
