const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth')
const ProductsController = require('../controllers/products')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null,new Date().toDateString().replace(/\s+/g, '_') + file.originalname);
    }

});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

router.get('/', checkAuth, ProductsController.products_get_all)

router.get('/:productId', checkAuth, ProductsController.products_get_one)

router.post('/', upload.single('productImage'), checkAuth, ProductsController.products_post)

router.patch('/:productId', checkAuth, ProductsController.products_update)

router.delete('/:productId', checkAuth, ProductsController.products_delete)

module.exports = router;

