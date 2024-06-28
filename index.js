const express = require('express');
const categoriesApp = require('./routes/categories');
const productsApp = require('./routes/products');
const usersApp = require('./routes/users');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());
app.use('/categories', categoriesApp);
app.use('/products', productsApp);
app.use('/users', usersApp);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});