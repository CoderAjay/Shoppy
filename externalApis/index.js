'use strict';
var request = require('request');
var Promise = require('bluebird');
var Memcached = require('memcached');
var memcached = new Memcached(['127.0.0.1:11211'], {
    maxKeySize: 1000
});

var _generateApiUrl = function(url, options) {
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            if (key.indexOf('fl') > -1) {
                for (filter in options[key]) {
                    url = _addParam(url, key, options[key][filter]);
                }
            } else {
                url = _addParam(url, key, options[key]);
            }
        }
    }
    return url;
};

var _addParam = function(url, key, value) {
    if (url.indexOf('?') !== -1) {
        url += '&' + key + '=' + value;
    } else {
        url += '?' + key + '=' + value;
    }
    return url;
};


var shopstyleCredentials = function() {
    return {
        pid: 'uid8400-26147220-78'
    };
};

var shopstyleFilterTypes = [
    'Category',
    'Brand',
    'Retailer',
    'Price',
    'Discount',
    'Size',
    'Color'
];

var shopstyleEndpoints = function() {
    return {
        Category: '/categories',
        product: '/products/',
        productSearch: '/products',
        productsHistogram: '/products/histogram',
    };
};

var getFromMemcached = function(url, cb) {
    memcached.get(encodeURI(url), cb);
};

var setToMemcached = function(url, body) {
    memcached.set(encodeURI(url), body, 2592000, function(err, result) {

    });
};

var shopstyleRequest = function(url) {
    return new Promise(function(resolve, reject) {
        getFromMemcached(url, function(error, data) {
            if (!error && data) {
                console.log('memcached');
                resolve(JSON.parse(data));
            } else {
                request(url, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        setToMemcached(url, body);
                        resolve(JSON.parse(body));
                    } else {
                        reject(error);
                    }
                });
            }
        });

    });
};

var shopstyleFetch = function(endpoint, options) {
    var url, apiUrl;

    apiUrl = 'http://api.shopstyle.com/api/v2' + endpoint;
    apiUrl += "?pid=" + shopstyleCredentials().pid;
    url = _generateApiUrl(apiUrl, options);
    return shopstyleRequest(url);
};

var shopstyleProductFetch = function(options) {
    var endpoint = shopstyleEndpoints().product + options.id;

    return new Promise(function(resolve, reject) {
        shopstyleFetch(endpoint, options).then(function(res) {
            if (res.id) {
                resolve(res);
            } else {
                reject(new Error(res));
            }
        }, function() {
            reject(new Error({
                status: 504,
                message: 'Unreachable'
            }));
        });
    });
};

var shopstyleRelatedProductFetch = function(options) {
    var endpoint = shopstyleEndpoints().product + options.id + '/related';
    return new Promise(function(resolve, reject) {
        shopstyleFetch(endpoint, options).then(function(res) {
            if (res.products) {
                resolve(res);
            } else {
                reject(new Error(res));
            }
        }, function() {
            reject(new Error({
                status: 504,
                message: 'Unreachable'
            }));
        });
    });
};

var shopstyleProductSearch = function(options) {
    var endpoint = shopstyleEndpoints().productSearch;
    return new Promise(function(resolve, reject) {
        shopstyleFetch(endpoint, options).then(function(res) {
            if (res.products) {
                resolve(res);
            } else {
                reject(new Error(res));
            }
        }, function() {
            reject(new Error({
                status: 504,
                message: 'Unreachable'
            }));
        });
    });

};

var shopstyleProductHistogram = function(options) {
    if (options.filters === null) {
        return new Error("No filter groups provided");
    }
    var endpoint = shopstyleEndpoints().productsHistogram;
    return new Promise(function(resolve, reject) {
        shopstyleFetch(endpoint, options).then(function(res) {
            if (res.metadata.histograms) {
                resolve(res);
            } else {
                reject(new Error(res));
            }
        }, function() {
            reject(new Error({
                status: 504,
                message: 'Unreachable'
            }));
        });
    });
};

var shopstyleProductCategory = function(options) {
    options = {};
    var endpoint = shopstyleEndpoints().Category;
    return new Promise(function(resolve, reject) {
        shopstyleFetch(endpoint, options).then(function(res) {
            if (res) {
                resolve(res);
            } else {
                reject(new Error(res));
            }
        }, function() {
            reject(new Error({
                status: 504,
                message: 'Unreachable'
            }));
        });
    });

};

module.exports = exports = {
    shopstyleProductHistogram: shopstyleProductHistogram,
    shopstyleProductSearch: shopstyleProductSearch,
    shopstyleRelatedProductFetch: shopstyleRelatedProductFetch,
    shopstyleProductFetch: shopstyleProductFetch,
    shopstyleProductCategory: shopstyleProductCategory
};
