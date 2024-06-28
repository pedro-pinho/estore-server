const express = require('express');
const pool = require('../shared/pool');
const bcryptjs = require('bcryptjs');
const usersApp = express.Router();

usersApp.get('/', (req, res) => {
  pool.query('SELECT * from users', (error, users) => {
    if (!error) {
      res.status(200).send(users);
    } else {
      res.status(500).send(error);
    }
  });
});

usersApp.post('/signup', (req, res) => {
  try {
    const { first_name, last_name, address, city, state, pin, email, password } = req.body;
    pool.query('SELECT count(*) FROM users WHERE email = ?', email, async (error, results) => {
      if (error) {
        res.status(500).send({
          error: error.code,
          message: error.message
        });
      } else {
        if (results[0]['count(*)'] > 0) {
          res.status(409).send({ error: 409, message: 'User already exists' });
        } else {
          const hashedPassword = await bcryptjs.hash(password, 10);
          pool.query('INSERT INTO users (first_name, last_name, address, city, state, pin, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [first_name, last_name, address, city, state, pin, email, hashedPassword], (error) => {
            if (error) {
              res.status(500).send({
                error: error.code,
                message: error.message
              });
            } else {
              res.status(201).send({message: 'User created'});
            }
          });
        }
      }
    });
  } catch (error) {
    res.status(500).send({
      error: error.code,
      message: error.message
    });
  }
});

module.exports = usersApp;