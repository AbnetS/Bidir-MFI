/** *
 * Load Module Dependencies.
 */
var EventEmitter = require('events').EventEmitter;

var debug      = require('debug')('api:branch-controller');
var async      = require('async');
var moment     = require('moment');
var _          = require('lodash');

var config          = require('../config');
var CustomError     = require('../lib/custom-error');


/**
 * Create a branch.
 *
 * @desc create a branch and add them to the database
 *
 * @param {Object} req HTTP Request Object
 * @param {Object} res HTTP Response Object
 * @param {Function} next Middleware dispatcher
 */
exports.create = function createBranch(req, res, next) {
  debug('create branch');

  // Begin workflow
  var workflow = new EventEmitter();
  var body = req.body;

  // validating branch data
  // cant trust anyone
  workflow.on('validate', function validateBranch() {

    var errs = req.validationErrors();

    if(errs) {
      return next(CustomError({
        name: 'RESOURCE_CREATION_ERROR',
        message: errs.message
      }));
    }

    workflow.emit('createBranch');
  });

  workflow.on('createBranch', function createBranch() {
    var verificationLink;


    Branch.create(body, function (err, branch) {
      if(err) {
        return next(CustomError({
          name: 'RESOURCE_CREATION_ERROR',
          message: err.message
        }));
      }


      workflow.emit('completeRegistration', branch);

    });


  });


  workflow.on('completeRegistration', function (branch) {

    res.status(201).json(branch);
  });

  workflow.emit('validate');
};

/**
 * Get a single branch.
 *
 * @desc Fetch a branch with the given id from the database.
 *
 * @param {Object} req HTTP Request Object
 * @param {Object} res HTTP Response Object
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function fetchOneBranch(req, res, next) {
  debug('fetch branch:' + req.params.id);

  var query = {
    _id: req.params.id
  };

  Branch.get(query, function cb(err, branch) {
    if(err) {
      return next(CustomError({
        name: 'SERVER_ERROR',
        message: err.message,
        status: 500
      }));
    }

    res.json(branch);
  });
};

/**
 * Update a single branch.
 *
 * @desc Fetch a branch with the given id from the database
 *       and update their data
 *
 * @param {Object} req HTTP Request Object
 * @param {Object} res HTTP Response Object
 * @param {Function} next Middleware dispatcher
 */
exports.update = function updateBranch(req, res, next) {
  debug('updating branch:'+ req.params.id);

  var query = {
    _id: req.params.id
  };
  var body = req.body;

  Branch.update(query, body, function cb(err, branch) {
    if(err) {
      return next(CustomError({
        name: 'SERVER_ERROR',
        message: err.message
      }));
    }

    res.json(branch);

  });

};

/**
 * Delete/Archive a single branch.
 *
 * @desc Fetch a branch with the given id from the database
 *       and delete their data
 *
 * @param {Object} req HTTP Request Object
 * @param {Object} res HTTP Response Object
 * @param {Function} next Middleware dispatcher
 */
exports.delete = function deleteBranch(req, res, next) {
  debug('deleting branch:' + req.params.id);

  var query = {
    _id: req.params.id
  };

  Branch.delete(query, function cb(err, branch) {
    if(err) {
      return next(CustomError({
        name: 'SERVER_ERROR',
        message: err.message
      }));
    }


    res.json(branch);

  });

};

/**
 * Get a collection of branchs with pagination
 *
 * @desc Fetch a collection of branchs
 *
 * @param {Object} req HTTP Request Object
 * @param {Object} res HTTP Response Object
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function fetchAllbranchs(req, res, next) {
  debug('get a collection of branchs');

  var page   = req.query.page || 1;
  var limit  = req.query.per_page || 10;

  var opts = {
    page: page,
    limit: limit,
    sort: { }
  };
  var query = {};

  Branch.getCollectionByPagination(query, opts, function cb(err, branchs) {
    if(err) {
      return next(CustomError({
        name: 'SERVER_ERROR',
        message: err.message
      }));
    }

    res.json(branchs);
  });
};

/**
 * Get a collection of branchs
 *
 * @desc Fetch a collection of branchs
 *
 * @param {Object} req HTTP Request Object
 * @param {Object} res HTTP Response Object
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAll = function fetchAllbranchs(req, res, next) {
  debug('get a collection of branchs');

  var query = {};
  var opts = {};

  Branch.getCollection(query, opts, function cb(err, branchsStream) {
    if(err) {
      return next(CustomError({
        name: 'SERVER_ERROR',
        message: err.message
      }));
    }

    res.setHeader('Content-Type', 'application/json');

    branchsStream.pipe(res);
  });
};
