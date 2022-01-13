const express = require('express');
const router  = express.Router();

module.exports = (db, app) => {


  app.post("/quiz/:id", (req, res) => {
    console.log("req.body---->", req.body)
    let promises = []
    const user_id = req.session.user_id;
    const quiz_id = req.params.id;
    console.log("req.params ---->", req.params)
    for (let question in req.body){
      const question_id = question;
      const user_answer = req.body[question_id];
      promises.push(db.query(`INSERT INTO answers (user_id,quiz_id,question_id,user_answer) VALUES ($1, $2, $3, $4);`, [user_id, quiz_id, question_id, user_answer]));
    }


    return Promise.all(promises)
    .then((response) => {
      // res.send(req.body.question.id);
      res.redirect(`/${quiz_id}/result`);
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
