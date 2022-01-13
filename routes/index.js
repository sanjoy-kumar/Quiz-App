/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
// const app = express();
const router  = express.Router();

module.exports = (db,app) => {

  app.get("/", (req, res) => {
    // const user_id = req.session.user_id;
    Promise.all([db.query(`SELECT * FROM users WHERE name = 'Josue';`),
    db.query('SELECT * FROM quizzes;'),
    db.query('SELECT results.*, count(questions.question) as total_score, quizzes.name FROM results JOIN quizzes ON results.quiz_id = quizzes.id JOIN questions ON questions.quiz_id = results.quiz_id WHERE results.user_id = 3 GROUP BY results.id, quizzes.name LIMIT 1;')])
    .then(data => {
      const userData = data[0];
      const quizData = data[1];
      const resultData = data[2];

      const templateVars = {
        user: userData.rows[0],
        featuredQuiz: quizData.rows[0],
        quizzes: quizData.rows.slice(1),
        result: resultData.rows[0],
      };
      delete req.session.user_id;
      req.session.user_id = templateVars.result.user_id;
      console.log(req.session.user_id);
      console.log("result --->", templateVars.result)
      res.render("index", templateVars);
    })

  });

  app.get("/category/:category", (req, res) => {
    // const user_id = req.session.user_id;
    const category = req.params.category;
    Promise.all([db.query(`SELECT * FROM users WHERE name = 'Josue';`),
    db.query('SELECT * FROM quizzes WHERE category = $1;', [category]),
    db.query('SELECT results.*, count(questions.question) as total_score, quizzes.name FROM results JOIN quizzes ON results.quiz_id = quizzes.id JOIN questions ON questions.quiz_id = results.quiz_id WHERE results.user_id = 3 GROUP BY results.id, quizzes.name LIMIT 1;')])
    .then(data => {
      const userData = data[0];
      const quizData = data[1];
      const resultData = data[2];

      const templateVars = {
        user: userData.rows[0],
        featuredQuiz: quizData.rows[0],
        quizzes: quizData.rows.slice(1, 5),
        result: resultData.rows[0],
        category: category
      };
      res.render("index", templateVars);
    })

  });

  router.get('login/:id', (req,res) => {
    // session cookies
    req.session.user_id = req.params.id;

    // redirect user somewhere
    res.redirect('/');
  });



  return router;
};



