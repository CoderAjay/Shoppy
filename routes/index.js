var express = require('express');
var router = express.Router();
var apiss = require('../externalApis');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Express',
        name: ' Ajay Singh'
    });
});

router.get('/products', function(req, res) {
    res.send('in progress');
});


router.get('/products/:id', function(req, res) {
    var product, taxonomy;
    apiss.shopstyleProductFetch({
        id: req.params.id
    }).then(function(prod) {
        product = prod;
        return apiss.shopstyleRelatedProductFetch({
            id: req.params.id
        });
    }).then(function(tax) {
        taxonomy = tax.products;
        res.render('index', {
            product: product,
            taxonomy: taxonomy
        });
    }, function(err) {
        res.render('error', {
            error: err.message
        });
    });
});
module.exports = router;
