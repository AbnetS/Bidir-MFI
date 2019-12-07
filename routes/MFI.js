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
 * @api {post} /MFI/create Create a new MFI
 * @apiVersion 1.0.0
 * @apiName CreateMFI
 * @apiGroup MFI
 *
 * @apiDescription Create new MFI. Data to be submitted as multipart/form-data
 *
 * @apiParam {String} name MFI's Name
 * @apiParam {String} location MFI's location
 * @apiParam {String} logo MFI's logo
 * @apiParam {String} [establishment_year] Establishment Year
 * @apiParam {String} [website_link] Website Link
 * @apiParam {String} [email] MFI's Contact Email Address
 * @apiParam {String} [phone] MFI's Contact Phone Number
 * @apiParam {String} [contact_person] MFI's Contact Person
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
router.post('/create', acl(['*']), mfiController.create);


/**
 * @api {get} /MFI/all Get MFIs collection
 * @apiVersion 1.0.0
 * @apiName FetchAll
 * @apiGroup MFI
 *
 * @apiDescription Get a collection of mfis.
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
 *     [{
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
 */
router.get('/all', acl(['*']), mfiController.fetchAll);

/**
 * @api {get} /MFI/logo Get MFI's logo
 * @apiVersion 1.0.0
 * @apiName GetLogo
 * @apiGroup MFI
 *
 * @apiDescription Get a MFI Logo.
 *
 * @apiSuccess {String} logo MFI logo
 *
 * @apiSuccessExample Response Example:
 *     {
 *        logo: "https://fb.cdn.ugusgu.us./MFI/285475474224.png"
 *    }
 */
router.get('/logo', mfiController.getLogo);


/**
 * @api {get} /MFI/:id Get MFI record
 * @apiVersion 1.0.0
 * @apiName GetMFI
 * @apiGroup MFI
 *
 * @apiDescription Get MFI record with the given id
 *
 * @apiSuccess {String} _id MFI id
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
 * @api {put} /MFI/:id Update MFI record
 * @apiVersion 1.0.0
 * @apiName UpdateMFI
 * @apiGroup MFI 
 *
 * @apiDescription Update MFI record with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *     phone: "+251911454656"
 * }
 *
 * @apiSuccess {String} _id MFI id
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
 *    phone: "+251911454656",
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

/**
 * @api {delete} /MFI/:id Delete MFI record
 * @apiVersion 1.0.0
 * @apiName DeleteMFI
 * @apiGroup MFI 
 *
 * @apiDescription Delete the MFI record with the given id
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
router.delete('/:id', acl(['*']), mfiController.remove);



// Expose MFI Router
module.exports = router;
