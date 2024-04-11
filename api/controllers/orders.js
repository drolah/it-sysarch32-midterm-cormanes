const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(result => {
        res.status(200).json({
            count: result.length,
            orders: result.map(data => {
                return {
                    _id: data._id,
                    product: data.product,
                    quantity: data.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/'+result._id
                    }
                }
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}




exports.orders_get_one = (req, res, next) => {
    Order.findById(req.params.orderId)
    .select('product quantity _id')
    .populate('product')
    .exec()
    .then(result => {
        if(!result){
            return res.status(500).json({
                message: 'Order not found!'
            })
        }else{
            res.status(200).json({
                order: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/order'
                }
            })
        }
        
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}




exports.Orders_post = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if(!product){
            return res.status(500).json({
                message: 'Product not found!'
            })
        }
        else{
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order
            .save()
            .then(result => {
                res.status(201).json({
                    message: 'Order saved!',
                    createdorder: {
                        _id: result._id,
                        product: result.product,
                        quantity: result.quantity
                    },
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/'+result._id
                    }
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            }
            );
        }
        
    })
}




exports.Orders_delete = (req, res, next) => {
    Order.findById(req.params.orderId).exec()
    .then(result => {
        if(!result){
            return res.status(500).json({
                message: 'Order not found!'
            })
        }
        else{
            Order.deleteOne({_id: req.params.orderId}).exec()
            .then(result => {
                res.status(200).json({
                message: 'Order deleted!',
                result,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders'
                }
            })
            })
            .catch(err => {
                res.status(200).json({
                error: err
            })
            })
        }
    })
}