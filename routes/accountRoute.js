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
 * Deliver management view
 *************************/
router.get("/", utilities.checkLogin, utilities.handleErrors(controller.buildManagement));

/* ***********************
 * Deliver login view
 *************************/
router.get("/login", utilities.handleErrors(controller.buildLogin));

/* ***********************
 * Deliver registration view
 *************************/
router.get("/register", utilities.handleErrors(controller.buildRegister));

/* ***********************
 * Deliver update view
 *************************/
router.get("/update/:accountId", utilities.handleErrors(controller.buildUpdate))

// router.post('/register', utilities.handleErrors(controller.registerAccount))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(controller.registerAccount)
)

// // Process the login attempt
// router.post(
//   "/login",
//   (req, res) => {
//     res.status(200).send('login process')
//   }
// )

router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(controller.accountLogin)
)

router.post(
    "/update",
    regValidate.updateInfoRules(),
    regValidate.checkUpdInfoData,
    utilities.handleErrors(controller.updateInfo)
)

router.post(
    "/update-password",
    regValidate.passwordUpdateRules(),
    regValidate.checkUpdtPasswordData,
    utilities.handleErrors(controller.passwordUpdate)
)

router.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    req.flash("notice", "You have been logged out.");    
    return res.redirect("/");
});

module.exports = router;