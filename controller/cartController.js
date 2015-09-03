'use strcit';
var mongoose = require('mongoose');
var CartProduct = mongoose.model('CartProduct');

function all(req, res) {
    CartProduct.find({
        sessionID: req.sessionID
    }, function(err, products) {
        if (!err && products) {
            res.send(products);
        } else {
            res.send(err);
        }
    });
}

function one(req, res) {
    CartProduct.findOne({
        sessionID: req.sessionID,
        id: Number(req.params.id)
    }, function(err, product) {
        if (!err && product) {
            res.send(product);
        } else {
            res.send(err);
        }
    });
}

function create(req, res) {
    var json = req.body;
    json.sessionID = req.sessionID;
    new CartProduct(json).save(function(err, product) {
        if (!err && product) {
            res.send(product);
        } else {
            res.send(err);
        }
    });
}

function patch(req, res) {
    var json = req.body;
    CartProduct.remove({
        sessionID: req.sessionID,
        id: Number(req.params.id)
    }, function(err, product) {
        new CartProduct(json).save(function(err, product) {
            if (!err && product) {
                res.send(product);
            } else {
                res.send(err);
            }
        });
    });

}

function destroy(req, res) {
    CartProduct.remove({
        sessionID: req.sessionID,
        id: Number(req.params.id)
    }, function(err, product) {
        if (!err && product) {
            res.send(product);
        } else {
            res.send(err);
        }
    });
}


module.exports = {
    create: create,
    patch: patch,
    one: one,
    all: all,
    destroy: destroy
};
