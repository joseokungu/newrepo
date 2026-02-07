/* ***********************
 * Account routes
 * Deliver login view 
 *************************/
//Needed Ressources
const express = require("express")
const router = new express.Router() 
const controller = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')

/* ***********************
 * Deliver login view
 *************************/
router.get("/login", utilities.handleErrors(controller.buildLogin));

/* ***********************
 * Deliver registration view
 *************************/
router.get("/register", utilities.handleErrors(controller.buildRegister));

// router.post('/register', utilities.handleErrors(controller.registerAccount))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(controller.registerAccount)
)


module.exports = router;