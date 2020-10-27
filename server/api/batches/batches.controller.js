'use strict';

var _ = require('lodash');
var Batches = require('./batches.model');
var moment = require('moment');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
// Get list of Batches
exports.index = function(req, res) {
  console.log("index");
    Batches.find(function (err, batches) {
    if(err) { return handleError(res, err); }
    return res.json(200, batches);
  });
};

// Get a single Batches
exports.show = function(req, res) {
  console.log("show");
    Batches.findById(req.params.id, function (err, batch) {
    if(err) { return handleError(res, err); }
    if(!batch) { return res.send(404); }
    return res.json(batch);
  });
};

// Creates a new Batches in the DB.
exports.create = function(req, res) {
    Batches.create(req.body, function(err, batch) {
    if(err) { return handleError(res, err); }
    else
    return res.json(batch);
  });
};

// Updates an existing v in the DB.
exports.update = function(req, res) {
  console.log("update");
  if(req.body._id) { delete req.body._id; }
  Batches.findById(req.params.id, function (err, batch) {
    if (err) { return handleError(res, err); }
    if(!batch) { return res.send(404); }
    var updated = _.merge(batch, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, batch);
    });
  });
};

// Deletes a v from the DB.
exports.destroy = function(req, res) {
    Batches.findById(req.params.id, function (err, batch) {
    if(err) { return handleError(res, err); }
    if(!batch) { return res.send(404); }
    batch.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.updateMultiple = function (req, res) {
  var batchesToSave = []
  console.log("req.body.batches", req.body.length);
  if(!req.body || req.body.length == 0) return handleError(res, "No Batches to Update ")
    async.each(req.body, function(batch, next){
      batchesToSave.push(batch);
      next();
    }, function(err){
      if(err)
        return handleError(res, err);
      var bulk = Batches.collection.initializeUnorderedBulkOp();
      _.forEach(batchesToSave, function (batch) {
        bulk.find({_id: new ObjectId(batch._id)}).updateOne({$set: {orderIds : batch.orderIds}});
      });
       if(!batchesToSave || batchesToSave.length != 0) {
        bulk.execute(function(err, bulkres){
            if (err) return handleError(res, err);
            return res.status(200).json({msg: 'Batches updated successfully'});
        });
       } else {
          return handleError(res, "No Batches to Update ")
       }
    })    
}

function handleError(res, err) {
  return res.send(500, err);
}