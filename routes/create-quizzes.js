const express = require("express");
const router = express.Router();

const {
  insertQuizIntoQuizzes,
} = require("../db/queries/create-quiz-queries.js");



// localhost:8080/quizzes/create-quiz

router.get("/create-quiz", (req, res) => {
  const user_id = req.session.user_id;
  res.render("create-quiz", { user_id });
});


//localhost:8080/quizzes/create-quiz
router.post("/create-quiz", (req, res) => {
  const request = req.body;
  const user_id = req.session.id;
  insertQuizIntoQuizzes(request, user_id)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => console.error("error create quiz", e));
});



module.exports = router;


