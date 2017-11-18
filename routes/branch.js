'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:branch-router');

const branchController  = require('../controllers/branch');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /MFI/branches/create Create new branch
 * @apiVersion 1.0.0
 * @apiName Createbranch
 * @apiGroup Branch
 *
 * @apiDescription Create new branch
 *
 * @apiParam {String} MFI Parent MFI Reference ID
 * @apiParam {String} name Branch Name
 * @apiParam {String} location Branch Location
 * @apiParam {String} opening_date Opening Date
 * @apiParam {String} branch_type Branch Type
 * @apiParam {String} email Branch Contact Email Address
 * @apiParam {String} phone Branch Contact Phone Number
 * @apiParam {String} [status] Branch Status, defaults to active
 *
 * @apiParamExample Request Example:
 *  {
 *    MFI: "556e1174a8952c9521286a60",
 *    name: "Branch",
 *    email: "branch@mfi.com",
 *    phone: "0987654321",
 *    location: "Bole, Addis Ababa, Ethiopia",
 *    opening_date: "2017-10-10T00:00.000Z",
 *    branch_type: "Local"
 *  }
 *
 * @apiSuccess {String} _id branch id
 * @apiSuccess {Object} MFI Parent MFI Reference 
 * @apiSuccess {String} name Branch Name
 * @apiSuccess {String} location Branch Location
 * @apiSuccess {String} opening_date Opening Date
 * @apiSuccess {String} branch_type Branch Type
 * @apiSuccess {String} email Branch Contact Email Address
 * @apiSuccess {String} phone Branch Contact Phone Number
 * @apiSuccess {String} status Branch Status, defaults to active
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60"
 *    MFI: {
 *      _id : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    name: "Branch",
 *    email: "branch@mfi.com",
 *    phone: "0987654321",
 *    location: "Bole, Addis Ababa, Ethiopia",
 *    opening_date: "2017-10-10T00:00.000Z",
 *    branch_type: "Local",
 *    status: "active"
 *  }
 *
 */
router.post('/create', acl(['*']), branchController.create);


/**
 * @api {get} /MFI/branches/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get branchs collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup Branch
 *
 * @apiDescription Get a collection of branchs. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id branch id
 * @apiSuccess {Object} MFI Parent MFI Reference 
 * @apiSuccess {String} name Branch Name
 * @apiSuccess {String} location Branch Location
 * @apiSuccess {String} opening_date Opening Date
 * @apiSuccess {String} branch_type Branch Type
 * @apiSuccess {String} email Branch Contact Email Address
 * @apiSuccess {String} phone Branch Contact Phone Number
 * @apiSuccess {String} status Branch Status, defaults to active
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *    	_id : "556e1174a8952c9521286a60"
 *    	MFI: {
 *      	_id : "556e1174a8952c9521286a60",
 *      	...
 *    	},
 *    	name: "Branch",
 *    	email: "branch@mfi.com",
 *    	phone: "0987654321",
 *    	location: "Bole, Addis Ababa, Ethiopia",
 *    	opening_date: "2017-10-10T00:00.000Z",
 *    	branch_type: "Local",
 *    status: "active"
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), branchController.fetchAllByPagination);

/**
 * @api {get} /MFI/branches/:id Get branch branch
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Branch
 *
 * @apiDescription Get a user branch with the given id
 *
 * @apiSuccess {String} _id branch id
 * @apiSuccess {Object} MFI Parent MFI Reference 
 * @apiSuccess {String} name Branch Name
 * @apiSuccess {String} location Branch Location
 * @apiSuccess {String} opening_date Opening Date
 * @apiSuccess {String} branch_type Branch Type
 * @apiSuccess {String} email Branch Contact Email Address
 * @apiSuccess {String} phone Branch Contact Phone Number
 * @apiSuccess {String} status Branch Status, defaults to active
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60"
 *    MFI: {
 *      _id : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    name: "Branch",
 *    email: "branch@mfi.com",
 *    phone: "0987654321",
 *    location: "Bole, Addis Ababa, Ethiopia",
 *    opening_date: "2017-10-10T00:00.000Z",
 *    branch_type: "Local",
 *    status: "active"
 *  }
 *
 */
router.get('/:id', acl(['*']), branchController.fetchOne);


/**
 * @api {put} /MFI/branches/:id Update branch branch
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Branch 
 *
 * @apiDescription Update a branch branch with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    phone: "0987654321"
 * }
 *
 * @apiSuccess {String} _id branch id
 * @apiSuccess {Object} MFI Parent MFI Reference 
 * @apiSuccess {String} name Branch Name
 * @apiSuccess {String} location Branch Location
 * @apiSuccess {String} opening_date Opening Date
 * @apiSuccess {String} branch_type Branch Type
 * @apiSuccess {String} email Branch Contact Email Address
 * @apiSuccess {String} phone Branch Contact Phone Number
 * @apiSuccess {String} status Branch Status, defaults to active
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60"
 *    MFI: {
 *      _id : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    name: "Branch",
 *    email: "branch@mfi.com",
 *    phone: "0987654321",
 *    location: "Bole, Addis Ababa, Ethiopia",
 *    opening_date: "2017-10-10T00:00.000Z",
 *    branch_type: "Local",
 *    status: "active"
 *  }
 */
router.put('/:id', acl(['*']), branchController.update);

/**
 * @api {put} /MFI/branches/:id/status Update branch Status
 * @apiVersion 1.0.0
 * @apiName UpdateStatus
 * @apiGroup Branch 
 *
 * @apiDescription Update a branch status with the given id
 *
 * @apiParam {Object} status Status active or inactive
 *
 * @apiParamExample Request example:
 * {
 *    status: "inactive"
 * }
 *
 * @apiSuccess {String} _id branch id
 * @apiSuccess {Object} MFI Parent MFI Reference 
 * @apiSuccess {String} name Branch Name
 * @apiSuccess {String} location Branch Location
 * @apiSuccess {String} opening_date Opening Date
 * @apiSuccess {String} branch_type Branch Type
 * @apiSuccess {String} email Branch Contact Email Address
 * @apiSuccess {String} phone Branch Contact Phone Number
 * @apiSuccess {String} status Branch Status, defaults to active
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60"
 *    MFI: {
 *      _id : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    name: "Branch",
 *    email: "branch@mfi.com",
 *    phone: "0987654321",
 *    location: "Bole, Addis Ababa, Ethiopia",
 *    opening_date: "2017-10-10T00:00.000Z",
 *    branch_type: "Local",
 *    status: "inactive"
 *  }
 */
router.put('/:id/status', acl(['*']), branchController.updateStatus);

/**
 * @api {get} /MFI/branches/search?QueryTerm=<QueryValue> Search branches 
 * @apiVersion 1.0.0
 * @apiName Search
 * @apiGroup Branch
 *
 * @apiDescription Search Branches. 
 *
 * @apiSuccess {String} _id branch id
 * @apiSuccess {Object} MFI Parent MFI Reference 
 * @apiSuccess {String} name Branch Name
 * @apiSuccess {String} location Branch Location
 * @apiSuccess {String} opening_date Opening Date
 * @apiSuccess {String} branch_type Branch Type
 * @apiSuccess {String} email Branch Contact Email Address
 * @apiSuccess {String} phone Branch Contact Phone Number
 * @apiSuccess {String} status Branch Status, defaults to active
 *
 * @apiSuccessExample Response Example:
 *   [{
 *    	_id : "556e1174a8952c9521286a60"
 *    	MFI: {
 *      	_id : "556e1174a8952c9521286a60",
 *      	...
 *    	},
 *    	name: "Branch",
 *    	email: "branch@mfi.com",
 *    	phone: "0987654321",
 *    	location: "Bole, Addis Ababa, Ethiopia",
 *    	opening_date: "2017-10-10T00:00.000Z",
 *    	branch_type: "Local",
 *    status: "active"
 *    }]
 */
router.get('/search', acl(['*']), branchController.search);

/**
 * @api {delete} /MFI/branches/:id Delete branch
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Branch 
 *
 * @apiDescription Delete a  branch with the given id
 *
 *
 * @apiSuccess {String} _id branch id
 * @apiSuccess {Object} MFI Parent MFI Reference 
 * @apiSuccess {String} name Branch Name
 * @apiSuccess {String} location Branch Location
 * @apiSuccess {String} opening_date Opening Date
 * @apiSuccess {String} branch_type Branch Type
 * @apiSuccess {String} email Branch Contact Email Address
 * @apiSuccess {String} phone Branch Contact Phone Number
 * @apiSuccess {String} status Branch Status, defaults to active
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60"
 *    MFI: {
 *      _id : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    name: "Branch",
 *    email: "branch@mfi.com",
 *    phone: "0987654321",
 *    location: "Bole, Addis Ababa, Ethiopia",
 *    opening_date: "2017-10-10T00:00.000Z",
 *    branch_type: "Local",
 *    status: "active"
 *  }
 */
router.delete('/:id', acl(['*']), branchController.remove);


// Expose branch Router
module.exports = router;
