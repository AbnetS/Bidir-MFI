'use strict';
// Access Layer for MFI Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-mfi');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const MFI    = require('../models/MFI');
const Branch = require('../models/branch');
const mongoUpdate   = require('../lib/mongo-update');

var returnFields = MFI.attributes;
var population = [{
  path: 'branches',
  select: Branch.attributes
}];

/**
 * create a new mfi.
 *
 * @desc  creates a new mfi and saves them
 *        in the database
 *
 * @param {Object}  mfiData  Data for the mfi to create
 *
 * @return {Promise}
 */
exports.create = function create(mfiData) {
  debug('creating a new mfi');

  return co(function* () {

    let unsavedMFI = new MFI(mfiData);
    let newMFI = yield unsavedMFI.save();
    let mfi = yield exports.get({ _id: newMFI._id });

    return mfi;


  });

};

/**
 * delete a mfi
 *
 * @desc  delete data of the mfi with the given
 *        id
 *
 * @param {Object}  query   Query Object
 *
 * @return {Promise}
 */
exports.delete = function deleteMFI(query) {
  debug('deleting mfi: ', query);

  return co(function* () {
    let mfi = yield exports.get(query);
    let _empty = {};

    if(!mfi) {
      return _empty;
    } else {
      yield mfi.remove();

      return mfi;
    }

  });
};

/**
 * update a mfi
 *
 * @desc  update data of the mfi with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 *
 * @return {Promise}
 */
exports.update = function update(query, updates) {
  debug('updating mfi: ', query);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  return MFI.findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();
};

/**
 * get a mfi.
 *
 * @desc get a mfi with the given id from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.get = function get(query, mfi) {
  debug('getting mfi ', query);

  return MFI.findOne(query, returnFields)
    .populate(population)
    .exec();

};

/**
 * get a collection of mfis
 *
 * @desc get a collection of mfis from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of mfis');

  return MFI.find(query, returnFields)
    .populate(population)
    .exec();
};

/**
 * get a collection of mfis using pagination
 *
 * @desc get a collection of mfis from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of mfis');

  let opts = {
    select:  returnFields,
    sort:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };


  return new Promise((resolve, reject) => {
    MFI.paginate(query, opts, function (err, docs) {
      if(err) {
        return reject(err);
      }

      let data = {
        total_pages: docs.pages,
        total_docs_count: docs.total,
        current_page: docs.page,
        docs: docs.docs
      };

      return resolve(data);

    });
  });


};
