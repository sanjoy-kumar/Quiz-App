/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db, app) => {

  app.get("/create-quiz", (req, res) => {
    Promise.all([db.query(`SELECT * FROM users WHERE name = 'Josue';`)])
      .then(data => {
        const userData = data[0];
        console.log(userData);
        const templateVars = {
          user: userData.rows[0]
        };
        res.render("create-quiz", templateVars);
      })
  });

  app.post("/create-quiz", (req, res) => {
    const user_id = req.body.user_id;
    const quiz_type = req.body.quiz_type;
    const name = req.body.name;
    const description = req.body.description;
    const category = req.body.category;
    const image_url = req.body.image_url;
    const queryString = `INSERT INTO quizzes (user_id,quiz_type,name,description,category,image_url) VALUES  ($1, $2, $3, $4, $5, $6) RETURNING *;`;
    return db
      .query(queryString, [
        user_id,
        quiz_type,
        name,
        description,
        category,
        image_url
      ])
      .then((response) => {
        return response.rows[0];
      })
      .then((data) => {
        let templateVars = {
          id: data.id,
          user_id: data.user_id
        };
        console.log(templateVars);
        res.render("create-question", templateVars);
      });
  });


  return router;
};



