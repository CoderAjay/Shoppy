var express = require('express');
var router = express.Router();
var apiss = require('../externalApis');
var options = require('../config');


router.get('/', function(req, res) {
    res.render('home', {
        options: options
    });
});
router.get('/search', function(req, res) {
    options.current.title = 'Search';
    options.current.page = 'search';
    apiss.shopstyleProductSearch({
        fts: req.query.q,
        offset: 0,
        limit: 50
    }).then(function(results) {
        res.render('search', {
            products: results.products,
            subtitle: 'Serach Results',
            options: options
        });
    }, function(err) {
        res.render('error', {
            error: JSON.stringify(err)
        });
    });
});

router.get('/products', function(req, res) {
    res.send('in progress');
});


router.get('/products/:id', function(req, res) {
    var product, taxonomy, subtitle = 'Related Products';
    apiss.shopstyleProductFetch({
        id: req.params.id
    }).then(function(prod) {
        product = prod;
        return apiss.shopstyleRelatedProductFetch({
            id: req.params.id
        });
    }).then(function(tax) {
        taxonomy = tax.products;
        res.render('productmain', {
            product: product,
            products: taxonomy,
            subtitle: subtitle,
            options: options
        });
    }, function(err) {
        res.render('error', {
            error: err.message
        });
    });
});
module.exports = router;
