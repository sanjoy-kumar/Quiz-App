const express = require('express');
const router  = express.Router();

module.exports = (db, app) => {


  app.post("/quiz/:id", (req, res) => {

    let promises = []
    const user_id = req.session.user_id;
    const quiz_id = req.params.id;
    // let rowsresults = 0;
    console.log("req.params ---->", req.params)

    for (let question in req.body){
      const question_id = question;
      const user_answer = req.body[question_id];
      Promise.all([db.query('SELECT count(*) from results;')])
      .then((response) => {
       const rowsresults = parseInt(response[0].rows[0].count) + 1;
        console.log(rowsresults);
        promises.push(db.query(`INSERT INTO answers (user_id,quiz_id,question_id,result_id,user_answer) VALUES ($1, $2, $3,$4, $5);`, [user_id, quiz_id, question_id, rowsresults,user_answer]));
      });

    }
    promises.push(db.query('SELECT * FROM questions WHERE quiz_id = $1;', [quiz_id]));

    Promise.all(db.query('SELECT * FROM questions WHERE quiz_id = $1;', [quiz_id])
    .then((response) => {
      let result = 0;
      for (let question of response.rows){
        if (question.answer === req.body[question.id]) {
          result++
        }
      }
      promises.push(db.query(`INSERT INTO results (user_id,quiz_id,score) VALUES ($1, $2, $3);`, [user_id, quiz_id, result]));
     return Promise.all([db.query('SELECT * FROM results WHERE quiz_id = $1 ORDER BY id DESC LIMIT 1;', [quiz_id])])
      .then((response) => {
        const results = response[0];
        console.log(results.rows[0]);
        setTimeout(function() {
          res.redirect(`/${quiz_id}/result/${results.rows[0].id}`);
      }, 10000);

      })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });

      });
    }))

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
