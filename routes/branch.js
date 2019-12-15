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
 * @api {post} /MFI/branches/create Create branch
 * @apiVersion 1.0.0
 * @apiName CreateBranch
 * @apiGroup Branch
 *
 * @apiDescription Create a new branch
 *
 * @apiParam {String} name Branch Name
 * @apiParam {String} location Branch Location
 * @apiParam {String} [opening_date] Opening Date
 * @apiParam {String} [branch_type] Branch Type
 * @apiParam {String} [email] Branch Contact Email Address
 * @apiParam {String} [phone] Branch Contact Phone Number
 * @apiParam {String} [status] Branch Status, defaults to active
 * @apiParam {String[]} [weredas] Wereda Ids covered by the branch
 *
 * @apiParamExample Request Example:
 *  {
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
 * @apiSuccess {object[]} weredas List of Weredas covered by the branch
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
 *    weredas: [],
 *    status: "active"
 *  }
 *
 */
router.post('/create', acl(['*']), branchController.create);


/**
 * @api {get} /MFI/branches/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get branches collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup Branch
 *
 * @apiDescription Get a collection of branches. The endpoint has pagination
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
 * @apiSuccess {object[]} weredas List of Weredas covered by the branch
 * @apiSuccess {String} status Branch Status, defaults to active
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 1,
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
    *       weredas: [],
    *       status: "active",
    *      
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), branchController.fetchAllByPagination);


/**
 * @api {get} /MFI/branches/search?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Search branches
 * @apiVersion 1.0.0
 * @apiName SearchBranch
 * @apiGroup Branch
 *
 * @apiDescription Get a collection of branches by search. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 * 
 * @apiExample Example usage
 * api.test.bidir.gebeya.co/branches/search?search=meki
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
 * @apiSuccess {object[]} weredas List of Weredas covered by the branch
 * @apiSuccess {String} status Branch Status, defaults to active
 *
 * @apiSuccessExample Response Example:
 *  {
    "total_pages": 1,
    "total_docs_count": 1,
    "current_page": 1,
    "docs": [
        {
            "_id": "5b926c849fb7f20001f1494c",
            "last_modified": "2019-02-14T09:04:02.962Z",
            "date_created": "2018-09-07T12:18:12.643Z",
            "name": "Meki Branch",
            "location": "Meki",
            "geolocation": {
                "latitude": 8.154061,
                "longitude": 38.826025
            },
            "weredas": [
                {
                    "_id": "5c5b3df639e95000017c54b8",
                    "last_modified": "2019-02-06T20:05:10.035Z",
                    "date_created": "2019-02-06T20:05:10.035Z",
                    "w_code": "41006",
                    "w_name": "Haro Maya"
                }
            ],
            "status": "active",
            "phone": "251221234554",
            "email": "",
            "branch_type": "Regional office",
            "opening_date": "1970-01-01T00:00:00.000Z"
        }
    ]
}
 */
router.get('/search', acl(['*']), branchController.search);

/**
 * @api {get} /MFI/branches/:id Get a branch
 * @apiVersion 1.0.0
 * @apiName GetBranch
 * @apiGroup Branch
 *
 * @apiDescription Get a branch with the given id
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
 * @apiSuccess {object[]} weredas List of Weredas covered by the branch
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
 *    weredas: [],
 *    status: "active"
 *  }
 *
 */
router.get('/:id', acl(['*']), branchController.fetchOne);


/**
 * @api {put} /MFI/branches/:id Update branch
 * @apiVersion 1.0.0
 * @apiName UpdateBranch
 * @apiGroup Branch 
 *
 * @apiDescription Update a branch with the given id
 *
 * @apiParam {Object} Data Update data. Data to be submitted as multipart/form-data
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
 * @apiSuccess {object[]} weredas List of Weredas covered by the branch
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
 *    weredas: [],
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
 * @apiParam {Object} status - active or inactive
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
 * @apiSuccess {object[]} weredas List of Weredas covered by the branch
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
 *    weredas: [],
 *    status: "inactive"
 *  }
 */
router.put('/:id/status', acl(['*']), branchController.updateStatus);

/**
 * @api {get} /MFI/branches/search?QueryTerm=<QueryValue> Search branches 
 * @apiVersion 1.0.0
 * @apiName SearchBranch
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
 * @apiSuccess {object[]} weredas List of Weredas covered by the branch
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
 *      wereda: [],
 *    status: "active"
 *    }]
 */
router.get('/search', acl(['*']), branchController.search);

/**
 * @api {delete} /MFI/branches/:id Delete branch
 * @apiVersion 1.0.0
 * @apiName DeleteBranch
 * @apiGroup Branch 
 *
 * @apiDescription Delete a branch with the given id
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
 * @apiSuccess {object[]} weredas List of Weredas covered by the branch
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
 *    weredas: [],
 *    status: "active"
 *  }
 */
router.delete('/:id', acl(['*']), branchController.remove);


// Expose branch Router
module.exports = router;
