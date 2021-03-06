// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

app.use(cookieSession({
  name: 'session',
  keys: ["Secret, Secret, so many secrets", "key"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const indexRoute = require("./routes/index");
const resultsRoutes = require("./routes/results");
const quizlistsRoutes = require("./routes/list");
const takeQuizRoute = require("./routes/take-quiz");
const quizzesRoutes = require("./routes/quizzes");
const questionsRoutes = require("./routes/questions");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own

// app.use("/api/index", indexRoute(db));
//app.use("/api/create-quiz", quizzesRoutes(db));
//app.use("/results", resultsRoutes(db));


// Note: mount other resources here, using the same pattern above
resultsRoutes(db,app);
quizlistsRoutes(db,app);
takeQuizRoute(db, app);
quizzesRoutes(db,app);
questionsRoutes(db,app);
indexRoute(db, app);


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// app.get("/", (req, res) => {
//   res.render("index");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT} `);
});
