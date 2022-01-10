const pool = require("../lib/db.js");

// Insert quiz into quizzes table
const insertQuizIntoQuizzes = (request, user_id) => {
  const user_id = user_id;
  const quiz_type = request.quiz_type;
  const name = request.name;
  const description = request.description;
  const queryString = `INSERT INTO quizzes (user_id,quiz_type,name,description) VALUES  ($1, $2, $3, $4) RETURNING *;`;
  return pool
    .query(queryString, [
      user_id,
      quiz_type,
      name,
      description
    ])
    .then((response) => {
      return response.rows;
    });
};


module.exports = {
  insertQuizIntoQuizzes
};

