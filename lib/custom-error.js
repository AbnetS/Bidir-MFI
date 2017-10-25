//A Custom error constructor

/**
 * Load Module Dependencies
 */
var httpStatus = require ('http-status');

/**
 * CustomError Type Definition.
 *
 * @param {Object} info error information
 *
 */
function CustomError(info) {
  if(!(this instanceof CustomError)) {
    return new CustomError(info);
  }  
  
  this.specific_errors = [];
  this.status  = info.status ? info.status : 400;
  this.message    = httpStatus[this.status];   
  this.specific_errors = info.specific_errors;

  //to create a uniform interface, replace the mongoose-validator parameters
  if (this.specific_errors){ 
    for (i = 0;i<this.specific_errors.length; i++){
      if (this.specific_errors[i].msg){
        this.specific_errors[i].message = this.specific_errors[i]['msg'];
        delete this.specific_errors[i].msg;
      }
      if (this.specific_errors[i].param){
        this.specific_errors[i].source = this.specific_errors[i]['param'];
        delete this.specific_errors[i].param;
      }
    }
  }
}

CustomError.prototype = Object.create(Error.prototype);

CustomError.prototype.constructor = CustomError;

// Expose Constructor
module.exports = CustomError;
