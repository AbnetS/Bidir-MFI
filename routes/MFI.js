'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:mfi-router');

const mfiController  = require('../controllers/MFI');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /MFI/create Create new MFI
 * @apiVersion 1.0.0
 * @apiName CreateMFI
 * @apiGroup MFI
 *
 * @apiDescription Create new MFI. Data to be submitted as multipart/form-data
 *
 * @apiParam {String} name MFI Name
 * @apiParam {String} location MFI location
 * @apiParam {String} logo MFI logo
 * @apiParam {String} establishment_year Establishment Year
 * @apiParam {String} website_link Website Link
 * @apiParam {String} email MFI Contact Email Address
 * @apiParam {String} phone MFI Contact Phone Number
 * @apiParam {String} contact_person MFI Contact Person
 *
 * @apiParamExample Request Example:
 *  {
 *    logo: "<DATA_OBJECT>",
 *    name: "MFI",
 *    email: "contact@mfi.com",
 *    contact_person: "Mary Jane",
 *    phone: "0967889977",
 *    establishment_year: "1992",
 *    location: "Radisson Blu, That Avenue, 3rd Floor, Addis Ababa, Ethiopia",
 *    website_link: "https://MFI.com/"
 *  }
 *
 * @apiSuccess {String} _id mfi id
 * @apiSuccess {String} name MFI Name
 * @apiSuccess {String} location MFI location
 * @apiSuccess {String} logo MFI logo
 * @apiSuccess {String} establishment_year Establishment Year
 * @apiSuccess {String} website_link Website Link
 * @apiSuccess {String} email MFI Contact Email Address
 * @apiSuccess {String} phone MFI Contact Phone Number
 * @apiSuccess {String} contact_person MFI Contact Person
 * @apiSuccess {Array} branches MFI Branches
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    logo: "https://fb.cdn.ugusgu.us./MFI/285475474224.png",
 *    name: "MFI",
 *    email: "contact@mfi.com",
 *    contact_person: "Mary Jane",
 *    phone: "0967889977",
 *    establishment_year: "1992",
 *    location: "Radisson Blu, That Avenue, 3rd Floor, Addis Ababa, Ethiopia",
 *    website_link: "https://MFI.com/",
 *    branches: []
 *  }
 *
 */
router.post('/create', acl(['admin']), mfiController.create);


/**
 * @api {get} /MFI/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get mfis collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup MFI
 *
 * @apiDescription Get a collection of mfis. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id mfi id
 * @apiSuccess {String} name MFI Name
 * @apiSuccess {String} location MFI location
 * @apiSuccess {String} logo MFI logo
 * @apiSuccess {String} establishment_year Establishment Year
 * @apiSuccess {String} website_link Website Link
 * @apiSuccess {String} email MFI Contact Email Address
 * @apiSuccess {String} phone MFI Contact Phone Number
 * @apiSuccess {String} contact_person MFI Contact Person
 * @apiSuccess {Array} branches MFI Branches
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *    		_id : "556e1174a8952c9521286a60",
 *    		logo: "https://fb.cdn.ugusgu.us./MFI/285475474224.png",
 *    		name: "MFI",
 *    		email: "contact@mfi.com",
 *    		contact_person: "Mary Jane",
 *    		phone: "0967889977",
 *    		establishment_year: "1992",
 *    		location: "Radisson Blu, That Avenue, 3rd Floor, Addis Ababa, Ethiopia",
 *    		website_link: "https://MFI.com/",
 *    		branches: []
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), mfiController.fetchAllByPagination);

/**
 * @api {get} /MFI/:id Get MFI MFI
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup MFI
 *
 * @apiDescription Get a user mfi with the given id
 *
 * @apiSuccess {String} _id mfi id
 * @apiSuccess {String} name MFI Name
 * @apiSuccess {String} location MFI location
 * @apiSuccess {String} logo MFI logo
 * @apiSuccess {String} establishment_year Establishment Year
 * @apiSuccess {String} website_link Website Link
 * @apiSuccess {String} email MFI Contact Email Address
 * @apiSuccess {String} phone MFI Contact Phone Number
 * @apiSuccess {String} contact_person MFI Contact Person
 * @apiSuccess {Array} branches MFI Branches
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    logo: "https://fb.cdn.ugusgu.us./MFI/285475474224.png",
 *    name: "MFI",
 *    email: "contact@mfi.com",
 *    contact_person: "Mary Jane",
 *    phone: "0967889977",
 *    establishment_year: "1992",
 *    location: "Radisson Blu, That Avenue, 3rd Floor, Addis Ababa, Ethiopia",
 *    website_link: "https://MFI.com/",
 *    branches: [{
 *	    _id : "556e1174a8952c9521286a60",
 *      ...
 *    }]
 *  }
 *
 */
router.get('/:id', acl(['*']), mfiController.fetchOne);


/**
 * @api {put} /MFI/:id Update MFI MFI
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup MFI 
 *
 * @apiDescription Update a MFI mfi with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    notes: "FB"
 * }
 *
 * @apiSuccess {String} _id mfi id
 * @apiSuccess {String} name MFI Name
 * @apiSuccess {String} location MFI location
 * @apiSuccess {String} logo MFI logo
 * @apiSuccess {String} establishment_year Establishment Year
 * @apiSuccess {String} website_link Website Link
 * @apiSuccess {String} email MFI Contact Email Address
 * @apiSuccess {String} phone MFI Contact Phone Number
 * @apiSuccess {String} contact_person MFI Contact Person
 * @apiSuccess {Array} branches MFI Branches
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    logo: "https://fb.cdn.ugusgu.us./MFI/285475474224.png",
 *    name: "MFI",
 *    email: "contact@mfi.com",
 *    contact_person: "Mary Jane",
 *    phone: "0967889977",
 *    establishment_year: "1992",
 *    location: "Radisson Blu, That Avenue, 3rd Floor, Addis Ababa, Ethiopia",
 *    website_link: "https://MFI.com/",
 *    branches: [{
 *	    _id : "556e1174a8952c9521286a60",
 *      ...
 *    }]
 *  }
 */
router.put('/:id', acl(['*']), mfiController.update);

// Expose MFI Router
module.exports = router;
