const express = require('express');
const products = express.Router();
const pool = require('../shared/pool');

// Helper function to build query string
const buildQuery = (mainCategoryId, subCategoryId, keyword) => {
  let query = 'SELECT * FROM products';

  if (mainCategoryId && subCategoryId) {
    throw new Error('You can only filter by maincategoryid or subcategoryid');
  }

  if (subCategoryId) {
    query += ' WHERE category_id = ?';
  }

  if (mainCategoryId) {
    query = `SELECT products.* FROM products, categories 
             WHERE products.category_id = categories.id 
             AND categories.parent_category_id = ?`;
  }

  if (keyword) {
    const keywordCondition = ` (keywords LIKE ? 
                            OR name LIKE ? 
                            OR description LIKE ?)`;

    if (mainCategoryId || subCategoryId) {
      query += ` AND${keywordCondition}`;
    } else {
      query += ` WHERE${keywordCondition}`;
    }
  }

  return query;
};

// GET /products
products.get('/', (req, res, next) => {
  const { maincategoryid: mainCategoryId, subcategoryid: subCategoryId, keyword } = req.query;

  try {
    const query = buildQuery(mainCategoryId, subCategoryId, keyword);
    const params = [];

    if (mainCategoryId) {
      params.push(mainCategoryId);
    } else if (subCategoryId) {
      params.push(subCategoryId);
    }

    if (keyword) {
      const keywordParam = `%${keyword}%`;
      params.push(keywordParam, keywordParam, keywordParam);
    }

    pool.query(query, params, (error, results) => {
      if (error) {
        return next(error);
      }
      res.status(200).json(results);
    });
  } catch (error) {
    next(error);
  }
});

// GET /products/:id
products.get('/:id', (req, res, next) => {
  const { id } = req.params;

  pool.query('SELECT * FROM products WHERE id = ?', [id], (error, results) => {
    if (error) {
      return next(error);
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).send('Product not found');
    }
  });
});

// Error handling middleware
products.use((err, req, res, next) => {
  if (err.message === 'You can only filter by maincategoryid or subcategoryid') {
    return res.status(400).send(err.message);
  }
  res.status(500).send('Internal Server Error');
});

module.exports = products;
