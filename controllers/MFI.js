'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');

const debug      = require('debug')('api:mfi-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');
const _          = require('lodash');
const co         = require('co');
const del        = require('del');
const validator  = require('validator');

const config             = require('../config');
const CustomError        = require('../lib/custom-error');
const googleBuckets      = require('../lib/google-buckets');

const TokenDal           = require('../dal/token');
const MFIDal          = require('../dal/MFI');
const LogDal             = require('../dal/log');
const BranchDal       = require('../dal/branch');


/**
 * Create a mfi.
 *
 * @desc create a mfi using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createMfi(next) {
  debug('create mfi');

  let body = this.request.body;
  let bodyKeys = Object.keys(body);
  let isMultipart = (bodyKeys.indexOf('fields') !== -1) && (bodyKeys.indexOf('files') !== -1);

  // If content is multipart reduce fields and files path
  if(isMultipart) {
    let _clone = {};

    for(let key of bodyKeys) {
      let props = body[key];
      let propsKeys = Object.keys(props);

      for(let prop of propsKeys) {
        _clone[prop] = props[prop];
      }
    }

    body = _clone;

  }

  let errors = [];

  if(!body.name) errors.push('MFI Name is Empty');
  if(!body.logo) errors.push('MFI Logo is Empty');
  if(!body.location) errors.push('MFI Location is Empty');

  if(errors.length) {
    return this.throw(new CustomError({
      type: 'MFI_CREATION_ERROR',
      message: JSON.stringify(errors)
    }));
  }

  try {

    // Prevent Creation of anymore MFIs just uno
    let mfi = yield MFIDal.get({});
    if(mfi) {
      throw new Error('MFI Already Bootstrapped!!');
    }
    
    if(body.logo) {
      let filename  = body.name.trim().toUpperCase().split(/\s+/).join('_');
      let id        = crypto.randomBytes(6).toString('hex');
      let extname   = path.extname(body.logo.name);
      let assetName = `${filename}_${id}${extname}`;

      let url       = yield googleBuckets(body.logo.path, assetName);

      body.logo = url;
    }

    // Create Mfi Type
    mfi = yield MFIDal.create(body);

    let defaultBranch = yield BranchDal.create({
      MFI: mfi._id,
      name: 'Head Office',
      location: body.location,
      phone: body.phone,
      email: body.email,
      branch_type: 'Head Office'
    });

    mfi = yield MFIDal.update({ _id: mfi },{
      branches: [defaultBranch._id]
    });

    this.body = mfi;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'MFI_CREATION_ERROR',
      message: ex.message
    }));
  }

};


/**
 * Get a single mfi.
 *
 * @desc Fetch a mfi with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneMfi(next) {
  debug(`fetch mfi: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let mfi = yield MFIDal.get(query);

    yield LogDal.track({
      event: 'view_mfi',
      mfi: this.state._user._id ,
      message: `View mfi - ${mfi.phone}`
    });

    this.body = mfi;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'MFI_RETRIEVAL_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update Mfi Status
 *
 * @desc Fetch a mfi with the given ID and update their respective status.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.updateStatus = function* updateMfi(next) {
  debug(`updating status mfi: ${this.params.id}`);

  this.checkBody('is_active')
      .notEmpty('is_active should not be empty');

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let mfi = yield MFIDal.update(query, body);

    yield LogDal.track({
      event: 'mfi_status_update',
      mfi: this.state._user._id ,
      message: `Update Status for ${mfi.phone}`,
      diff: body
    });

    this.body = mfi;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'MFI_STATUS_UPDATE_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Update a single mfi.
 *
 * @desc Fetch a mfi with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateMfi(next) {
  debug(`updating mfi: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let mfi = yield MFIDal.update(query, body);

    yield LogDal.track({
      event: 'mfi_update',
      mfi: this.state._user._id ,
      message: `Update Info for ${mfi.phone}`,
      diff: body
    });

    this.body = mfi;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_MFI_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of mfis by Pagination
 *
 * @desc Fetch a collection of mfis
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllMfis(next) {
  debug('get a collection of mfis by pagination');

  // retrieve pagination query params
  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};

  let sortType = this.query.sort_by;
  let sort = {};
  sortType ? (sort[sortType] = 1) : null;

  let opts = {
    page: +page,
    limit: +limit,
    sort: sort
  };

  try {
    let mfis = yield MFIDal.getCollectionByPagination(query, opts);

    this.body = mfis;
  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_PAGINATED_MFIS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Get a collection of mfis 
 *
 * @desc Fetch a collection of mfis
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAll = function* fetchAllMfis(next) {
  debug('get a collection of mfis');

  try {
    let query = {};
    let mfis = yield MFIDal.getCollection(query);

    this.body = mfis;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_MFIS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Delete a single mfi.
 *
 * @desc Fetch a mfi with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.remove = function* removeMfi(next) {
  debug(`remove mfi: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    // Delete MFI
    let mfi = yield MFIDal.delete(query);

    // Remove Branches
    for(let branch of mfi.branches) {
      yield BranchDal.delete({ _id: branch._id });
    }

    yield LogDal.track({
      event: 'mfi_delete',
      mfi: this.state._user._id ,
      message: `Delete Info for ${mfi.name}`
    });

    this.body = mfi;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_MFI_ERROR',
      message: ex.message
    }));

  }

};