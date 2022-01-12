/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db, app) => {

  app.post("/create-question", (req, res) => {
    const quiz_id = req.body.quiz_id;
    const question = req.body.question;
    const option1 = req.body.option1;
    const option2 = req.body.option2;
    const option3 = req.body.option3;
    const option4 = req.body.option4;
    const answer = req.body.answer;
    const queryString = `INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, answer)  VALUES  ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
    return db
      .query(queryString, [
        quiz_id,
        question,
        option1,
        option2,
        option3,
        option4,
        answer
      ])
      .then((response) => {
        res.redirect("/");
      });
  });


  return router;
};



