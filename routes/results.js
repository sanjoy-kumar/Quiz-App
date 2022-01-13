const express = require('express');
const router = express.Router();

module.exports = (db, app) => {

// viewing results from the quiz
  app.get("/:quiz_id/result", (req, res) => {
    console.log("test");
    let string = `
    SELECT quizzes.id,quizzes.name as quiz_name, users.name, results.score, results.completed_at, question, user_answer, answer , quizzes.quiz_type
    FROM results
    JOIN quizzes ON results.quiz_id = quizzes.id
    JOIN users ON users.id = results.user_id
    JOIN answers ON answers.user_id=results.user_id
    JOIN questions ON questions.id = answers.question_id
    WHERE quizzes.id = $1 and users.id = $2
    ORDER BY results.completed_at, results.id DESC;
    `;
    let string2 = "Select * from users Where id = $1;";
    let string3 = "SELECT COUNT(*) FROM questions where quiz_id = $1;";
    // let templateVar = [];
    Promise.all([db.query(string,[req.params.quiz_id, req.session.user_id]),
      db.query(string2,[req.session.user_id]), db.query(string3,[req.params.quiz_id])])
      .then(data => {
        // console.log(data[0].rows);
        const QResult = data[0];
        const UserData = data[1];
        const countQuestionsData = data[2]
        const templateVars = {
          quiz_result: QResult.rows,
          user: UserData.rows[0],
          countQuestions: countQuestionsData.rows
        };
        console.log("user data---->", templateVars.quiz_result[0].id)
        res.render("../views/result", templateVars);
        quiz_result[0].score
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    // db.query(string, [req.params.quiz_id, req.session.user_id])
    // .then(data => {
    //   let templateVar = {quiz_result: data.rows};
    //   console.log(templateVar);
    //   res.render("../views/result", templateVar);
    // })
    // .catch(err => {
    //   res
    //     .status(500)
    //     .json({ error: err.message });
    // });

  });

  // viewing users result from the quiz

  app.get("/:quiz_id/result/:user_id", (req, res) => {
    let string = `
    SELECT quizzes.name as quiz_name, users.name, results.score
    FROM results
    JOIN quizzes ON results.quiz_id = quizzes.id
    JOIN users ON users.id = results.user_id
    WHERE quiz_id = $1 and quizzes.user_id = $2
    ORDER BY results.id;
    `;
    db.query(string, [req.params.quiz_id, req.params.user_id])
    .then(data => {
      let templateVar = {complete_result: data.rows};
      // console.log(templateVar);
      res.render("../views/complete_result", templateVar);
    })
  });




  return router;
};
