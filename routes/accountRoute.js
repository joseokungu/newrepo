/* ***********************
 * Account routes
 * Deliver login view 
 *************************/
//Needed Ressources
const express = require("express")
const router = new express.Router() 
const controller = require("../controllers/accountController");
const utilities = require("../utilities");


/* ***********************
 * Deliver login view
 *************************/
router.get("/login", utilities.handleErrors(controller.buildLogin));


module.exports = router;