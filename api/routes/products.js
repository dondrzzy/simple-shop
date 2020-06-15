const express = require('express');
const router = express.Router();
const multer = require('multer');

const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const limits = {
  fileSize: 1024 * 10124 * 5, // 1kb * 1kb * 5 = 5mb
}

const upload = multer({ storage, limits, fileFilter });

router.use(checkAuth);

router.get('/', (req, res) => {
  Product.find({}, '-__v')
    .exec()
    .then(products => {
      products = products.map((product) => {
        return {
          ...product._doc,
          request: {
            type: 'POST',
            url: `http://locahost:3000/products/${product._id}`
          }
        }
      });
      res.status(200).json({ products });
    })
    .catch(error => {
      console.log('error', error);
      res.status(500).json({ error });
    })
});

router.post('/', upload.single('productImage'), checkAuth, (req, res) => {
  console.log('decoded', req.userData);
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product.save((error, product) => {
    if(error) {
      return res.status(400).json({ message: error });
    }
    res.status(201).json({
      product,
    });
  });
});

router.get('/:productId', (req, res) => {
  const id = req.params.productId;
  console.log('id', id);
  Product.findById(id)
    .select('name price')
    .exec()
    .then(product => {
      console.log('product', product);
      if (!product) {
        return res.status(404).json({
          message: `Product not found for id: ${id}`,
        });
      }
      res.status(200).json({
        product,
      });
    })
    .catch(error => {
      res.status(500).json({
        error,
      });
    });
});

router.patch('/:productId', async (req, res) => {
  id = req.params.productId;

  Product.update({ _id: id }, { $set: req.body}, { runValidators: true}, (err, result) => {
    if(err) {
      return res.status(400).json({ error: err });
    }
    return res.status(200).json({
      message: 'Product successfully updated',
    });
  });
});

router.delete('/:productId', (req, res) => {
  id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product successfully deleted'
      });
    })
    .catch( error => { res.status(500).json({ error })});
});

module.exports = router;
