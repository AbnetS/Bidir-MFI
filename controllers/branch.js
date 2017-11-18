'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');

const debug      = require('debug')('api:branch-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');
const _          = require('lodash');
const co         = require('co');
const del        = require('del');
const validator  = require('validator');

const config             = require('../config');
const CustomError        = require('../lib/custom-error');

const TokenDal           = require('../dal/token');
const BranchDal          = require('../dal/branch');
const LogDal             = require('../dal/log');
const MFIDal             = require('../dal/MFI');


/**
 * Create a branch.
 *
 * @desc create a branch using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createBranch(next) {
  debug('create branch');

  let body = this.request.body;

  this.checkBody('MFI')
      .notEmpty('MFI Reference ID is Empty');
  this.checkBody('name')
      .notEmpty('Branch Name is Empty!!');
  this.checkBody('location')
      .notEmpty('Branch Location is Empty!!');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'BRANCH_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let branch = yield BranchDal.get({ name: body.name });
    if(branch) {
      throw new Error('Branch with that name for the MFI already exists!!');
    }

    // Create Branch Type
    branch = yield BranchDal.create(body);

    this.body = branch;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'BRANCH_CREATION_ERROR',
      message: ex.message
    }));
  }

};


/**
 * Get a single branch.
 *
 * @desc Fetch a branch with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneBranch(next) {
  debug(`fetch branch: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let branch = yield BranchDal.get(query);

    yield LogDal.track({
      event: 'view_branch',
      branch: this.state._user._id ,
      message: `View branch - ${branch.phone}`
    });

    this.body = branch;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'BRANCH_RETRIEVAL_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update Branch Status
 *
 * @desc Fetch a branch with the given ID and update their respective status.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.updateStatus = function* updateBranch(next) {
  debug(`updating status branch: ${this.params.id}`);

  this.checkBody('status')
      .notEmpty('Status should not be empty');

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let branch = yield BranchDal.update(query, body);

    yield LogDal.track({
      event: 'branch_status_update',
      branch: this.state._user._id ,
      message: `Update Status for ${branch.name}`,
      diff: body
    });

    this.body = branch;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'BRANCH_STATUS_UPDATE_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Update a single branch.
 *
 * @desc Fetch a branch with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateBranch(next) {
  debug(`updating branch: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let branch = yield BranchDal.update(query, body);

    yield LogDal.track({
      event: 'branch_update',
      branch: this.state._user._id ,
      message: `Update Info for ${branch.phone}`,
      diff: body
    });

    this.body = branch;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_BRANCH_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of branchs by Pagination
 *
 * @desc Fetch a collection of branchs
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllBranchs(next) {
  debug('get a collection of branchs by pagination');

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
    let branchs = yield BranchDal.getCollectionByPagination(query, opts);

    this.body = branchs;
  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_PAGINATED_BRANCHS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Search  branches 
 *
 * @desc Fetch a collection searched branches
 *
 * @param {Function} next Middleware dispatcher
 */
exports.search = function* searchBranches(next) {
  debug('search branches');

  try {
    let query = this.request.query;

    if(!Object.keys(query).length) {
      throw new Error('Search Query is missing');
    }

    let branches = yield BranchDal.getCollection(query);

    this.body = branches;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'BRANCH_SEARCH_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Delete a single branch.
 *
 * @desc Fetch a branch with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.remove = function* removeBranch(next) {
  debug(`remove branch: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    // Delete Branch
    let branch = yield BranchDal.delete(query);

    // Remove From MFI collection
    let mfi = yield MFIDal.get({ _id: branch.MFI._id });
    let branches = [];

    for(let _branch of mfi.branches) {
      if(_branch._id !== branch._id) {
        branches.push(_branch._id);
      }
    }

    yield MFIDal.update({ _id: mfi._id }, { branches: branches });

    yield LogDal.track({
      event: 'branch_delete',
      mfi: this.state._user._id ,
      message: `Delete Info for ${branch.name}`
    });

    this.body = branch;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_BRANCH_ERROR',
      message: ex.message
    }));

  }

};