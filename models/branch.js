// Branch Model Definiton.

/**
 * Load Module Dependencies.
 */
var mongoose  = require('mongoose');
var moment    = require('moment');
var paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

var BranchSchema = new Schema({
    MFI:            { type: Schema.Types.ObjectId, ref:'MFI'},
    name:           { type: String },
    location:       { type: String },    
    opening_date:       { type: Date },
    branch_type:        { type: String },
    email:          { type: String },
    phone:          { type: String },
    status:         {type: String, enums:['active', 'inactive']}
    date_created:   { type: Date },
    last_modified:  { type: Date }
});

// add mongoose-troop middleware to support pagination
BranchSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 *        - Hash tokens password.
 */
BranchSchema.pre('save', function preSaveMiddleware(next) {
  var token = this;

  // set date modifications
  var now = moment().toISOString();

  token.date_created = now;
  token.last_modified = now;

  next();

});

/**
 * Branch Attributes to expose
 */
BranchSchema.statics.whitelist = {
  _id: 1,
  date_created:   1
};


// Expose Branch model
module.exports = mongoose.model('Branch', BranchSchema);
