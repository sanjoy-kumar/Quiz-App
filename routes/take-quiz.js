/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db, app) => {

  app.get("/quiz/:id", (req, res) => {
    Promise.all([db.query(`SELECT * FROM users WHERE name = 'Josue';`)])
        .then(data => {
          const userData = data[0];
          const templateVars = {
            user: userData.rows[0],
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
