'use strict';

var express = require('express');
var router = express.Router();
var User = require('../user/user.model');
var logger = require('../../components/logger');
var crypto = require('crypto');
var request = require('request');
var config = require('../../config/environment');
var shortid = require('shortid');
var mongoose = require('mongoose');
var hosts = config.hosts;
