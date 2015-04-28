/*global require,module */
'use strict';
var $ = require('jquery');
var Products = require('../products');

function getData(selector) {
    return new Promise(function(resolve, reject) {
        var output = [];
        $(selector).each(function(i, el) {
            var data = $(el).attr('data-model');
            $(el).attr('data-model', '');
            if (data) {
                try {
                    data = JSON.parse(data);
                } catch (e) {

                }
            }
            output.push(data);
        });
        resolve(output);
    });
}

function putPromise(json) {
    return new Promise(function(resolve, reject) {
        var i = 0,
            output = [];
        for (; i < json.length; i++) {
            output.push(getData(json[i]));
        }
        resolve(output);
    });
}

function all(json) {
    return putPromise(json).then(function(promises) {
        return Promise.all(promises)
            .then(function(output) {
                return output;
            });
    });
}

function initHome() {
    console.log('started with home');
}

function initSearch(q) {
    all(['.modelProduct']).then(function(data) {
        var products = data[0] || [];
        //bind all other/related products
        Products.productsView('#body-main', products);
    });
}

function initProduct(id) {
    var mainProduct;
    //get data for both block and link with current page
    all(['.modelProduct']).then(function(data) {
        var products = data[0] || [];
        mainProduct = data[0].filter(function(item) {
            return item.id == id;
        })[0];
        // bind main product with it view
        if (mainProduct) {
            console.log(mainProduct);
            Products.productView('.product-tmpl', mainProduct);
        }
        //bind all other/related products
        Products.productsView('#body-main', products);
    });

}

module.exports = {
    data: function(json) {
        return all(json);
    },
    initHome: initHome,
    initSearch: initSearch,
    initProduct: initProduct
};
