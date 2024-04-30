const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth')

const OrdersController = require('../controllers/orders');

// Handle incoming GET requests to /orders
router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/', checkAuth, OrdersController.Orders_post);

router.get('/:orderId', checkAuth, OrdersController.orders_get_one);

router.delete('/:orderId', checkAuth, OrdersController.Orders_delete);

router.patch('/:orderId', checkAuth, OrdersController.Orders_update);

module.exports = router;