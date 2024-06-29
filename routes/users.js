require("dotenv").config();
const express = require("express");
const pool = require("../shared/pool");
const bcryptjs = require("bcryptjs");
const jwtoken = require("jsonwebtoken");
const usersApp = express.Router();

usersApp.get("/", (req, res) => {
  pool.query("SELECT * from users", (error, users) => {
    if (!error) {
      res.status(200).send(users);
    } else {
      res.status(500).send(error);
    }
  });
});

usersApp.post("/signup", (req, res) => {
  try {
    const {
      first_name,
      last_name,
      address,
      city,
      state,
      pin,
      email,
      password,
    } = req.body;
    pool.query(
      "SELECT count(*) FROM users WHERE email = ?",
      email,
      async (error, results) => {
        if (error) {
          res.status(500).send({
            error: error.code,
            message: error.message,
          });
        } else {
          if (results[0]["count(*)"] > 0) {
            res
              .status(409)
              .send({ error: 409, message: "User already exists" });
          } else {
            const hashedPassword = await bcryptjs.hash(password, 10);
            pool.query(
              "INSERT INTO users (first_name, last_name, address, city, state, pin, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [
                first_name,
                last_name,
                address,
                city,
                state,
                pin,
                email,
                hashedPassword,
              ],
              (error) => {
                if (error) {
                  res.status(500).send({
                    error: error.code,
                    message: error.message,
                  });
                } else {
                  res.status(201).send({ message: "User created" });
                }
              }
            );
          }
        }
      }
    );
  } catch (error) {
    res.status(500).send({
      error: error.code,
      message: error.message,
    });
  }
});

usersApp.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    pool.query(
      "SELECT * FROM users WHERE email = ?",
      email,
      async (error, results) => {
        if (error) {
          res.status(500).send({
            error: error.code,
            message: error.message,
          });
        } else {
          if (results.length > 0) {
            const user = results[0];
            const passwordMatch = await bcryptjs.compare(
              password,
              user.password
            );
            if (passwordMatch) {
              const token = jwtoken.sign(
                { email: user.email, id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
              );
              res.status(200).send({
                token,
                expiresIn: 3600,
                user: {
                  id: user.id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  address: user.address,
                  city: user.city,
                  state: user.state,
                  pin: user.pin,
                },
              });
            } else {
              res
                .status(401)
                .send({ error: 401, message: "Invalid credentials" });
            }
          } else {
            res
              .status(401)
              .send({ error: 401, message: "Invalid credentials" });
          }
        }
      }
    );
  } catch (error) {
    res.status(400).send({
      error: error.code,
      message: error.message,
    });
  }
});

module.exports = usersApp;
