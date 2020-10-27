'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BatchesSchema = new Schema({
  batchName: String,
  startDate: {
  	type: Date,
  },
  endDate: {
    type: Date
  },
  timestamp : {
      type : Date,
      default : Date.now
  },
  status : {
      type : String,
  },
  orderIds : [],
  user : {},
  note : String
});

BatchesSchema
  .path('batchName')
  .validate(function(name) {
    return name.length;
  }, 'Name cannot be blank');

BatchesSchema
  .path('batchName')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({batchName: value}, function(err, module) {
      if(err) throw err;
      if(module) {
        if(self.id === module.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified Batch name is already in use.');

module.exports = mongoose.model('Batches', BatchesSchema);