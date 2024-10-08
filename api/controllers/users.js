const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.users_get_all = (req, res, next) => {
    User.find()
    .exec()
    .then(result => {
        res.status(200).json({
            count: result.length,
            users: result
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}

exports.users_post_signup = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(result => {
        if(result.length >= 1){
            return res.status(409).json({
                message: 'Email already exist!'
            })
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result => {
                        User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: 'Email not registered'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({
                    message: 'Login failed!'
                })
            }
            if(result){
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    process.env.MONGO_ATLAS_PW, 
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: 'Login successful!',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Login failed!'
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err  
                        })
                    })
                }
            })
        }
    })
}



exports.users_post_login = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: 'Email not registered'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({
                    message: 'Login failed!'
                })
            }
            if(result){
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    process.env.MONGO_ATLAS_PW, 
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: 'Login successful!',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Login failed!'
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}



exports.users_delete = (req, res, next) => {
    User.deleteOne({_id: req.params.userId}).exec()
    .then(result => {
        res.status(200).json({
            message: 'User account deleted!'
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}