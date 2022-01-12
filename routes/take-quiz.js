const express = require('express');
const router  = express.Router();

module.exports = (db, app) => {

  app.get("/quiz/:id", (req, res) => {
    const quiz = req.params.id;
    Promise.all([db.query("SELECT * FROM users WHERE name = 'Josue';"),
    db.query('SELECT * FROM quizzes WHERE id = $1',[quiz]),
    db.query('SELECT * FROM questions WHERE quiz_id = $1;', [quiz])])
        .then(data => {
          const userData = data[0];
          const quizData = data[1];
          const questionData = data[2];
          const templateVars = {
            user: userData.rows[0],
            quiz: quizData.rows[0],
            questions: questionData.rows,

          };
        res.render("take-quiz", templateVars);
console.log("questions", templateVars.questions)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
