'use strict';

var express = require('express');
var controller = require('./shopify.controller');

var router = express.Router();

router.get('/fetchOrders', controller.fetchOrders);
router.get('/fetchOrdersfromDb', controller.fetchOrdersfromDb);
router.get('/fetchProduct', controller.fetchProduct);
router.post('/createProduct', controller.createProduct);
router.post('/closeOrder', controller.closeOrder);

module.exports = router;
