var express = require('express');
var router = express.Router();

/* GET  listing. */
router.get('/', function(req, res) {
    res.send('API version 1.0.0');
});



/*
 memcache to store all product in cart
 */
var cart = require('../controller/cartController.js');
router.get('/cart', cart.all);
router.get('/cart/:id', cart.one);
router.post('/cart/:id', cart.create);
router.put('/cart/:id', cart.patch);
router.delete('/cart/:id', cart.destroy);

module.exports = router;
