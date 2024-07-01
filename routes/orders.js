const express = require("express");
const pool = require("../shared/pool");
const ordersApp = express.Router();
const checkToken = require("../shared/check-token");

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      },
    );
  });
};

const insertOrder = (userId, userName, address, city, state, pin, total) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO orders (user_id, user_name, address, city, state, pin, total) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    pool.query(
      query,
      [userId, userName, address, city, state, pin, total],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.insertId);
      },
    );
  });
};

const insertOrderDetails = (orderId, orderDetails) => {
  const promises = orderDetails.map((detail) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO order_details (order_id, product_id, quantity, price, amount) VALUES (?, ?, ?, ?, ?)`;
      pool.query(
        query,
        [
          orderId,
          detail.product_id,
          detail.quantity,
          detail.price,
          detail.amount,
        ],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        },
      );
    });
  });
  return Promise.all(promises);
};

ordersApp.post("/add", checkToken, async (req, res) => {
  const {
    userName,
    userEmail,
    address,
    city,
    state,
    pin,
    total,
    orderDetails,
  } = req.body;

  try {
    const userResults = await getUserByEmail(userEmail);
    if (userResults.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const userId = userResults[0].id;
    const orderId = await insertOrder(
      userId,
      userName,
      address,
      city,
      state,
      pin,
      total,
    );
    await insertOrderDetails(orderId, orderDetails);

    res.status(201).json({ message: "Order Placed" });
  } catch (err) {
    res.status(500).json({ error: err.code, message: err.message });
  }
});

module.exports = ordersApp;
