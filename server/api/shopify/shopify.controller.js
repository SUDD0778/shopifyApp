'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
// var nodemailer = require('nodemailer');
// var sgTransport = require('nodemailer-sendgrid-transport');
var cookie = require('cookie');
var nonce = require('nonce');
var querystring = require('querystring');
var request = require('request-promise');
var shopifyOrder = require('./shopifyOrder.model');
var Q = require('q');
var async = require('async');

exports.fetchOrders = function(req, res) {
    var shop;
    if(req.query.shop)
        shop = req.query.shop;
    else shop = config.shop;
    if(shop) {
        // GET /admin/api/2020-10/orders.json?updated_at_min=2005-07-31T15:57:11-04:00
        var today = new Date();
        today.setDate(today.getDate() - 1);
        today.toISOString();
        var url = 'https://' + config.apiKey + ':' + config.password + '@' + config.shop +'/admin/api/2020-10/orders.json?updated_at_min='
        +today;
        console.log("url", url);
        request(url, function (err, response, body) {
        if(err) res.status(500).send(err);
            var result = body ? JSON.parse(body) : {};
            writeOrdersInDb(result.orders ? result.orders : [])
            .then(function(orders) {
                res.status(200).send({msg : 'done'});
            })
            .catch(function(err){
                res.status(400).send(err);
            });
        })
    } else {
        res.status(400).send('Missing Shop parameter');
    }
};

function writeOrdersInDb (orders) {
    console.log("orders", orders.length);
    var deferred = Q.defer();
    async.eachSeries(orders,function(order, cb) {
        shopifyOrder.update({id : order.id},order,{upsert : true}, function(err, _order){
            if(err) deferred.reject(err);
            if(!_order) deferred.reject(err);
            cb()
        });
    },function (err) {
        if(err) deferred.reject(err);
        deferred.resolve(orders);
    });
    return deferred.promise;
}

exports.fetchProduct = function(req, res) {
    var shop;
    if(req.query.shop)
        shop = req.query.shop;
    else shop = config.shop;
    if(shop) {
        var url = 'https://' + config.apiKey + ':' + config.password + '@' + config.shop +'/admin/products.json'
        var shopifyReqHeader = {
            'content-type': 'application/json'
        };
        request.get(url, {headers : shopifyReqHeader})
            .then(function(result) {
                res.status(200).send(result);         
            })
            .catch(function(err) {
                console.log("error", err);
                res.status(500).send(err);
            })
    } else {
        res.status(400).send('Missing Shop parameter');
    }
}

exports.createProduct = function(req, res) {
    var shop;
    if(req.query.shop)
        shop = req.query.shop;
    else shop = config.shop;
    if(shop) {
        var url = 'https://' + config.apiKey + ':' + config.password + '@' + config.shop +'/admin/products.json'
        let new_product = {
            product: {
                title: 'Zara Mens',
                body_html: '<strong>Good snowboard!</strong>',
                vendor: 'Zara',
                product_type: 'Apparel',
                tags: [
                    'zara',
                    'men',
                ]
            }
        };
        console.log(req.query.shop);
        var url = 'https://' + config.apiKey + ':' + config.password + '@' + config.shop +'/admin/products.json';
    
        let options = {
            method: 'POST',
            uri: url,
            json: true,
            resolveWithFullResponse: true,//added this to view status code
            headers: {
                'content-type': 'application/json'
            },
            body: new_product
        };
    
        request.post(options)
            .then(function (response) {
                console.log(response.body);
                if (response.statusCode == 201) {
                    res.json(true);
                } else {
                    res.json(false);
                }
    
            })
            .catch(function (err) {
                console.log(err);
                res.json(false);
            });
    } else {
        res.status(400).send('Missing Shop parameter');
    }
}

exports.closeOrder = function(req, res) {
    console.log("closeOrder");
    var shop;
    if(req.query.shop)
        shop = req.query.shop;
    else shop = config.shop;
    if(shop) {
        console.log("req.body", req.body);
        if(req.body) {
            var order_id = req.body.id;
            console.log("order_id", order_id);
            var url = 'https://' + config.apiKey + ':' + config.password + '@' + config.shop +
            '/admin/api/2020-10/orders/' + order_id + '/fulfillments.json'
            // /admin/api/2020-10/orders/{order_id}/fulfillments.json
            // /admin/api/2020-10/orders/450789469/fulfillments.json
            // '/admin/api/2020-10/orders/' + order_id + '/close.json';
            console.log("url", url);
            request.post({
                method: 'POST',
                uri: url,
                json: true,
                resolveWithFullResponse: true,
                headers: {
                    'content-type': 'application/json'
                },
                body: {}
            }, function (err, response, body) {
                if(err) res.status(500).send(err);
                var result = body;
                console.log("response.statusCode", response.statusCode);
                if (response.statusCode == 200) {
                    console.log("response.statusCode", response.statusCode, response.body.order.id);
                    shopifyOrder.update({id : response.body.order.id},response.body.order,{upsert : true}, function(err, _order){
                        console.log("_order", _order_id);
                        if(err) handleError(res, err);
                        if(!_order) handleError(res, err);
                        console.log("done", response.body.order);
                        res.json(response.body.order);
                    });
                } else {
                    console.log("false");
                    res.json(false);
                }

            })
        } else {
            res.status(400).send('Missing order parameter');
        }
    } else {
        res.status(400).send('Missing Shop parameter');
    }
}

exports.fetchOrdersfromDb = function(req, res) {
    shopifyOrder.find({}, function(err, orders){
        if(err) handleError(res, err);
        if(!orders) hanldeError(res, err);
        res.status(200).send(orders);
    });
}

function handleError(res, err) {
    return res.send(500, err);
}