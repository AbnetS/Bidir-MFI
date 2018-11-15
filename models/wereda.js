// Wereda Model Definiton.

/**
 * Load Module Dependencies.
 */
var mongoose  = require('mongoose');
var moment    = require('moment');
var paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

var WeredaSchema = new Schema({
    w_name:           { type: String, unique: true },
    w_code:           { type: String, unique: true },
    date_created:   { type: Date },
    last_modified:  { type: Date }
});

// add mongoose-troop middleware to support pagination
WeredaSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 *        - Hash tokens password.
 */
WeredaSchema.pre('save', function preSaveMiddleware(next) {
  var instance = this;

  // set date modifications
  var now = moment().toISOString();

  instance.date_created = now;
  instance.last_modified = now;

  next();

});

/**
 * Filter Wereda Attributes to expose
 */
WeredaSchema.statics.attributes = {
  _id: 1,
  w_name: 1,
  w_code: 1,
  date_created: 1,
  last_modified: 1
};


// Expose Wereda model
module.exports = mongoose.model('Wereda', WeredaSchema);
