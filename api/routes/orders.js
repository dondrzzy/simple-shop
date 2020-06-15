const express = require('express');
const router = express.Router();

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res) => {
  Order.find({}, '-__v').populate('product', 'name').exec()
  .then(orders => {
    res.status(200).json({
      orders: orders.map((order) => ({
        ...order._doc,
        request: {
          type: 'GET',
          url: `http://locahost:3000/orders/${order._id}`
        }
      }))
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: err });
  })
});

router.post('/', (req, res) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      const order = new Order({
        quantity: req.body.quantity,
        product: product._id,
      });
      // chain a promise
      return order.save()
    })
    .then(order => {
      res.status(200).json({ message: 'Order successfully created', order });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get('/:orderId', async (req, res) => {
  productId = req.params.productId;
  try {
    const order = await Order.findById(req.params.orderId, '-__v').populate('product', '-__v');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(404).json({
        error
    });
  }

});

router.delete('/:orderId', async (req, res) => {
  try {
    const result = await Order.deleteOne({ _id: req.params.orderId });

    let message = 'Order not found'
    let status = 404;
    if (result.n === 1) {
      message = 'Order successfully deleted';
      status = 200;
    }
    return res.status(status).json({ message });

  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
        error
    });
  }
});

module.exports = router;
