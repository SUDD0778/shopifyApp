/**
 * Logger
 */
'use strict';

var winston = require('winston');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/shopify');
var Module = require('./server/api/module/module.model');
var Logs = require('./server/api/logs/logs.model');

var userLogger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      filename: 'user_error.log',
      name: 'user_error',
      level: 'error'
    }),
    new (winston.transports.File)({
      filename: 'user_info.log',
      name: 'user_info',
      level: 'info'
    })
  ]
});

var apiLogger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      filename: 'api_error.log',
      name: 'api_error',
      level: 'error'
    }),
    new (winston.transports.File)({
      filename: 'api_info.log',
      name: 'api_info',
      level: 'info'
    })
  ]
});

setInterval(function(){
    Module.find({}, 'name logs_last_updated', function(err, hosts){
      if(err)
        throw err;
      async.each(hosts, function(host, callback){
        var options = {
            from: new Date - 30 * 24 * 60 * 60 * 1000,
            until: new Date,
            limit: 100000,
            start: 0,
            order: 'asc',
            fields: ['message', 'timestamp']
          };
        options.from = host.logs_last_updated!=undefined?new Date(host.logs_last_updated):new Date - 30 * 24 * 60 * 60 * 1000;
        apiLogger.query(options, function (err, results) {
          if (err) {
            throw err;
          }
          var messages = [];
          results.api_info.forEach(function(log){
            var obj = {};
            obj = JSON.parse(log.message);
            if(obj.scope == host.name){
              obj.timestamp = log.timestamp;
              obj.scope_id = host._id;
              var newlog = new Logs.api(obj);
              newlog.save();
            }
          });
          Module.findByIdAndUpdate(host._id, {logs_last_updated: new Date()}, function(err, module){
            if(err) throw err;
            callback();
          });
        });
      },function(err){
        if(err)
          console.log(err);
        else{
          console.log("Module logs updated.");
        }
      });  
    });

    var options = {
      from: new Date - 30 * 24 * 60 * 60 * 1000,
      until: new Date,
      limit: 10000,
      start: 0,
      order: 'asc',
      fields: ['message', 'timestamp']
    };
    
    userLogger.query(options, function (err, results) {
      if (err) {
        throw err;
      }
      results.user_info.forEach(function(log){
        var obj = JSON.parse(log.message);
        obj.timestamp = log.timestamp;
        Logs.user.find({timestamp: log.timestamp}, function(err,logs){
          if(err) throw err;
          if(logs.length==0){
             var newlog = new Logs.user(obj);
             newlog.save();
          }
        });
      });
      console.log('User logs updated.');
    });
}, 1000*60*15);
  


