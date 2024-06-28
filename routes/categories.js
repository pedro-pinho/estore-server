const express = require('express');
const pool = require('../shared/pool');
const categoriesApp = express.Router();

categoriesApp.get('/', (req, res) => {
  pool.query('SELECT * from categories', (error, categories) => {
    if (!error) {
      res.status(200).send(categories);
    } else {
      res.status(500).send(error);
    }
  });
});

module.exports = categoriesApp;