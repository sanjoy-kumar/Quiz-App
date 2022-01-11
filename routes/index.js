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
  // app.get("/", (req, res) => {
  //   db.query(`SELECT * FROM users;`)
  //     .then(data => {
  //       const users = data.rows;
  //       res.json({ users });
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });

  app.get("/", (req, res) => {
 //ADD in completed_at to ERD
    Promise.all([db.query(`SELECT * FROM users WHERE name = 'Josue';`),
    db.query('SELECT * FROM quizzes LIMIT 5'),
    db.query('SELECT * FROM results LIMIT 1')])
    .then(data => {
      const userData = data[0];
      const quizData = data[1];
      const resultData = data[2];
      console.log("Data -->", data)
      console.log('quizdata.rows', quizData.rows)
      const templateVars = {
        user: userData.rows[0],
        quizzes: quizData.rows,
        result: resultData.rows[0]
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



