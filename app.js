const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

const connectionUri = `mongodb+srv://${process.env.SS_ADMIN_USERNAME}:${process.env.SS_ADMIN_PWD}@${process.env.SS_CLUSTER}/${process.env.SS_DB_NAME}?retryWrites=true&w=majority`

mongoose.connect(connectionUri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
  console.log('db connected');
});
mongoose.connection.on('error', error => {
  console.log('error: ', error);
});

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin',  '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
})

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      extra: 'extra',
    }
  })
})

module.exports = app;
