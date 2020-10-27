// create api keys using btoa(client_id:apiKey)
var apikey = "Basic SDFHVUtTZElXOmJ0K0YvOVRrRXZ1ckw2M24yc3YwY3pDTGppaSt3cEhlbTRQT2R4RXF2OFk9";
var crypto = require('crypto');
var credentials = (new Buffer(apikey.split(" ")[1], 'base64')).toString().split(":");
var decipher = crypto.createDecipher('aes-128-cbc-hmac-sha1', "shopify-api");
var scope = (decipher.update(credentials[1], 'base64', 'utf8') + decipher.final('utf8')).split(":")[1];
console.log(scope);
console.log(credentials);