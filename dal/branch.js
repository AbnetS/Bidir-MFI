// Access Layer for Branch Data.

/**
 * Load Module Dependencies.
 */
var debug   = require('debug')('api:dal-branch');
var moment  = require('moment');
var _       = require('lodash');

var Branch    = require('../models/branch');
var Address     = require('../models/address');
var mongoUpdate = require('../lib/mongo-update');

var returnFields = Branch.whitelist;
var population = [];

/**
 * create a new branch.
 *
 * @desc  creates a new branch and saves them
 *        in the database
 *
 * @param {Object}  branchData  Data for the branch to create
 * @param {Function} cb       Callback for once saving is complete
 */
exports.create = function create(branchData, cb) {
  debug('creating a new branch');

  var searchQuery = { };

  // Make sure branch does not exist
  Branch.findOne(searchQuery, function branchExists(err, isPresent) {
    if(err) {
      return cb(err);
    }

    if(isPresent) {
      return cb(new Error('Branch Already exists'));
    }


    // Create branch if is new.
    var branchModel  = new Branch(branchData);

    branchModel.save(function saveBranch(err, data) {
      if (err) {
        return cb(err);
      }


      exports.get({ _id: data._id }, function (err, branch) {
        if(err) {
          return cb(err);
        }

        cb(null, branch);

      });

    });

  });

};

/**
 * delete a branch
 *
 * @desc  delete data of the branch with the given
 *        id
 *
 * @param {Object}  query   Query Object
 * @param {Function} cb Callback for once delete is complete
 */
exports.delete = function deleteItem(query, cb) {
  debug('deleting branch: ', query);

  Branch
    .findOne(query, returnFields)
    .populate(population)
    .exec(function deleteBranch(err, branch) {
      if (err) {
        return cb(err);
      }

      if(!branch) {
        return cb(null, {});
      }

      branch.remove(function(err) {
        if(err) {
          return cb(err);
        }

        cb(null, branch);

      });

    });
};

/**
 * update a branch
 *
 * @desc  update data of the branch with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 * @param {Function} cb Callback for once update is complete
 */
exports.update = function update(query, updates,  cb) {
  debug('updating branch: ', query);

  var now = moment().toISOString();
  var opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  Branch
    .findOneAndUpdate(query, data, opts)
    .populate(population)
    .exec(function updateBranch(err, branch) {
      if(err) {
        return cb(err);
      }

      cb(null, branch || {});
    });
};

/**
 * get a branch.
 *
 * @desc get a branch with the given id from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.get = function get(query, cb) {
  debug('getting branch ', query);

  Branch
    .findOne(query, returnFields)
    .populate(population)
    .exec(function(err, branch) {
      if(err) {
        return cb(err);
      }

      cb(null, branch || {});
    });
};

/**
 * get a collection of branchs
 *
 * @desc get a collection of branchs from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.getCollection = function getCollection(query, qs, cb) {
  debug('fetching a collection of branchs');

  cb(null,
     Branch
      .find(query, returnFields)
      .populate(population)
      .stream({ transform: JSON.stringify }));

};

/**
 * get a collection of branchs using pagination
 *
 * @desc get a collection of branchs from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.getCollectionByPagination = function getCollection(query, qs, cb) {
  debug('fetching a collection of branchs');

  var opts = {
    columns:  returnFields,
    sortBy:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };


  Branch.paginate(query, opts, function (err, docs, page, count) {
    if(err) {
      return cb(err);
    }


    var data = {
      total_pages: page,
      total_docs_count: count,
      docs: docs
    };

    cb(null, data);

  });

};
