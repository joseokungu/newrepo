/* ****************************************
*  Account Controller
* *************************************** */
const utilities = require("../utilities/")

const accountCont = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData

  if (accountData) {
      return res.redirect("/account/")
  }

  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountCont.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
    const accountData = res.locals.accountData

  if (accountData) {
      return res.redirect("/account/")
  }
  res.render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}


module.exports = accountCont