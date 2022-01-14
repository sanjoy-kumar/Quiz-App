const express = require('express');
const router = express.Router();

module.exports = (db, app) => {

// viewing list of quizzes
  app.get("/quizzes/:userid", (req, res) => {
  //   console.log("test");
  //   let string = `
  //   SELECT quizzes.name as quiz_name, users.name, description, category, quizzes.image_url
  //   FROM quizzes
  //   JOIN users ON users.id = quizzes.user_id
  //   WHERE quiz_type = 't' and user_id = $1
  //   ORDER BY quizzes.id;
  //   `;
  //   db.query(string, [req.params.userid])
  //   .then(data => {
  //     let templateVar = {quiz_list: data.rows};
  //     console.log(templateVar);
  //     res.render("../views/quiz_list", templateVar);
  //   })
  //   .catch(err => {
  //     res
  //       .status(500)
  //       .json({ error: err.message });
  //   });

  // });
  let string1 = `SELECT quizzes.id, quizzes.name as quiz_name
  FROM quizzes
  JOIN users ON users.id = quizzes.user_id
  WHERE quiz_type = 't' and user_id = $1
  ORDER BY quizzes.id;`;
  let string2 = `SELECT quizzes.id, quizzes.name as quiz_name
  FROM quizzes
  JOIN users ON users.id = quizzes.user_id
  WHERE quiz_type = 'f' and user_id = $1
  ORDER BY quizzes.id;`;
  let string3 = 'SELECT quizzes.name as quiz_name, users.name, results.score FROM results    JOIN quizzes ON results.quiz_id = quizzes.id    JOIN users ON users.id = results.user_id    WHERE quizzes.user_id = $1    ORDER BY results.id;';
  let string4 = "Select * from users Where id = $1;";
  let string5 = 'SELECT quizzes.name as quiz_name, results.score FROM results    JOIN quizzes ON results.quiz_id = quizzes.id    JOIN users ON users.id = results.user_id    WHERE results.user_id = $1    ORDER BY results.id;';
  // let templateVar = [];
  Promise.all([db.query(string1,[req.params.userid]),
    db.query(string2,[req.params.userid]),
    db.query(string3,[req.params.userid]),
  db.query(string4,[req.session.user_id]),
db.query(string5,[req.session.user_id])])
    .then(data => {
      console.log(data[0].rows);
      const PublicData = data[0];
      const PrivateData = data[1];
      const ResultData = data[2];
      const UserData = data[3];
      const YourResults = data[4];
      const templateVars = {
        Public: PublicData.rows,
        Private: PrivateData.rows,
        Result: ResultData.rows,
        user: UserData.rows,
        MyResult : YourResults.rows
      };
      // console.log("sliced!", templateVars.quizzes)
      console.log(templateVars);
      res.render("../views/quiz_list", templateVars);
    })


    // res.render("../views/quiz_list", templateVar);
  });

  return router;
};
