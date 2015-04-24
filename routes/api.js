var express = require('express');
var router = express.Router();
var apiss = require('../externalApis');

/* GET  listing. */
router.get('/', function(req, res) {
    res.send('API version 1.0.0');
});



router.get('/search/:q', function(req, res) {
    apiss.shopstyleProductSearch({
        fts: req.params.q,
        offset: 0,
        limit: 50
    }).then(function(results) {
        res.json(results.products);
    }, function(err) {
        res.status(404).send(err);
    });
});

var cart = require('../controller/cartController.js');
router.get('/cart', cart.all);
router.get('/cart/:id', cart.one);
router.post('/cart/:id', cart.create);
router.put('/cart/:id', cart.patch);
router.delete('/cart/:id', cart.destroy);

module.exports = router;
