const express = require('express');
const router  = express.Router();

module.exports = (db, app) => {


  app.post("/quiz/:id", (req, res) => {
    console.log("req.body---->", req.body)
  //  const valueInsideRadio =  document.querySelector('input[name="question.id]:checked').value;
// console.log("VALUE --->", req)
    return db.query()
    .then((response) => {
      res.send(req.body.question.id);
      res.redirect("/:quiz_id/result");
    });
});

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
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
