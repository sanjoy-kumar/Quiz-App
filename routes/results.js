const express = require('express');
const router = express.Router();

module.exports = (db) => {

// viewing results from the quiz

  router.get("/:quiz_id/result", (req, res) => {
    let string = `
    SELECT quizzes.name, users.username, results.score
    FROM results
    JOIN quizzes ON results.quiz_id = quizzes.id
    JOIN users ON users.id = results.user_id
    WHERE quiz_id = $1
    ORDER BY id;
    `;
    db.query(string, [req.params.quiz_id])
    .then(data => {
      let templateVar = {attempt: data.rows}
      res.render("../views/result", templateVar);
    })
  })

  // viewing users result from the quiz

  router.get("/:quiz_id/result/:user_id", (req, res) => {
    let string = `
    SELECT quizzes.name, users.username, results.score
    FROM results
    JOIN quizzes ON results.quiz_id = quizzes.id
    JOIN users ON users.id = results.user_id
    WHERE quiz_id = $1 and user_id = $2
    ORDER BY id;
    `;
    db.query(string, [req.params.quiz_id, req.params.user_id])
    .then(data => {
      let templateVar = {attempt: data.rows}
      res.render("../views/result", templateVar);
    })
  })




  return router;
};
