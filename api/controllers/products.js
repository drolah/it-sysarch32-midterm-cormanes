const mongoose = require('mongoose');
const Product = require('../models/product');
const Order = require('../models/order');

exports.products_get_all = (req, res, next) => {
    Product.find()
    .select('_id name price productImage')
    .exec()
    .then(result => {
        const response = {
            count: result.length,
            products: result.map(data => {
                return {
                    id: data._id,
                    name: data.name,
                    price: data.price,
                    productImage: data.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'+ data._id
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}




exports.products_get_one = (req, res, next) => {
    const id = req.params.productId
    Product.findById({_id: id})
    .select('_id name price productImage')
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
            product: result,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products'
            }
        });
      } else {
        res.status(404)
          .json({ message: "No record ",id});
      }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}



exports.products_post = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save()
    .then(result => {
        console.log(result)
        res.status(201).json({
            message: "Product saved!",
            id: product._id,
            name: product.name,
            price: product.price,
            productImage: product.productImage,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/'+ result._id
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}


exports.products_update = (req, res, next) => {
    const id = req.params.productId
    const updateOps = {}
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    Product.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated!',
            product: result,
            request: {
                type: 'PATCH',
                url: 'http://localhost:3000/products/'+id
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}


exports.products_delete = (req, res, next) => {
    const id = req.params.productId
    
    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product deleted!',
            result,
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products'
            }
            
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}