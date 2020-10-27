'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderSchema = new Schema({
  id : {
      type : String,
      required : true
  },
  mail:String,
  closed_at: Date,
  created_at: Date,
  updated_at: Date,
  number: Number,
  note: String,
  token: String,
  gateway: String,
  test: Boolean,
  total_price: String,
  subtotal_price: String,
  total_weight: Number,
  total_tax: String,
  taxes_included: Boolean,
  currency: String,
  financial_status: String,
  confirmed: Boolean,
  total_discounts: String,
  total_line_items_price: String,
  cart_token: String,
  buyer_accepts_marketing: Boolean,
  name: String,
  referring_site: String,
  landing_site: String,
  cancelled_at: Date,
  cancel_reason: String,
  total_price_usd: String,
  checkout_token: String,
  reference: String,
  user_id: Number,
  location_id: Number,
  source_identifier: String,
  source_url: String,
  processed_at: Date,
  device_id: String,
  phone: Number,
  customer_locale: String,
  app_id: Number,
  browser_ip: String,
  landing_site_ref: String,
  order_number: Number,
  discount_applications: [],
  discount_codes: [],
  note_attributes: [],
  payment_gateway_names: [],
  processing_method: String,
  checkout_id: String,
  source_name: String,
  fulfillment_status: String,
  tax_lines : [],
  tags : String,
  contact_email : String,
  order_status_url : String,
  presentment_currency : String,
  total_line_items_price_set: {},
  total_discounts_set : {},
  total_shipping_price_set : {},
  subtotal_price_set : {},
  total_price_set : {},
  total_tax_set : {},
  line_items : [],
  fulfillments : [],
  refunds : [],
  total_tip_received : String,
  original_total_duties_set : String,
  current_total_duties_set : String,
  admin_graphql_api_id : String,
  shipping_lines : String,
});
OrderSchema
  .path('id')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({name: id, order: this.order}, function(err, order) {
      if(err) throw err;
      if(order) {
        if(self.id === order.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The order id is already in this module.');

module.exports = mongoose.model('orders', OrderSchema);