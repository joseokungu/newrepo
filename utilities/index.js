const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  // called and the data returned
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the details view HTML
* ************************************ */
Util.buildDetailsDisplay = async function (data) {

  const vehicle = data[0]
  
  let flex

  flex = '<div id="details-flex">'

  // flex += '<p><span class="price">' + JSON.stringify(vehicle, null, 2)    + '</span></p>'

  // Image part
    
  flex += '<div id="car-image">'
    
  flex += '<img src="' + vehicle.inv_image
    + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
    + ' on CSE Motors" />'
    
  flex += '</div>'
    
  // Details part
  flex += '<div id="car-details">'

  flex += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model
    
    + ' Details </h2>'
    
  flex += '<p class="price">Price: <span>$'
    
    + new Intl.NumberFormat('en-US').format(vehicle.inv_price)
      
    + '</span></p>'

  flex += '<p><b>Description: </b><span>' + vehicle.inv_description
    + '</span></p>'

  flex += '<p><b>Color: </b><span>' + vehicle.inv_color
    + '</span></p>'

  flex += '<p><b>Miles: </b><span>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles)
    + '</span></p>'
    
  flex += '</div>'

  flex += '</div>'

  return flex
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build the the classification list for the add-inventory view
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check if Manager or Admin
 * ************************************ */
Util.checkEmployeeOrAdmin = (req, res, next) => {

  try {
    const payload = res.locals.accountData

    // console.log(payload)

    if (payload.account_type === "Employee" || payload.account_type === "Admin") {

      res.locals.accountData = payload

      return next()
    }

    // If the logged user is not an admin or employee
    req.flash("notice", "You do not have permission to access this section")
    return res.redirect("account/login")

  } catch (err) {

    req.flash("notice", "Invalid session. Please log in again.")

    return res.redirect("account/login")

  }
}

/* ****************************************
 *  Check Client
 * ************************************ */
Util.checkClient = (req, res, next) => {

  try {
    const payload = res.locals.accountData

    // console.log(payload)

    if (payload.account_type === "Client") {

      res.locals.accountData = payload

      return next()
    }

    // If the logged user tries to enter and they are and employee or admin
    req.flash("notice", "Not permitted access. You should log in with your client account.")
    return res.redirect("/account/")

  } catch (err) {

    req.flash("notice", "Invalid session. Please log in again.")

    return res.redirect("/account/login")

  }
}


module.exports = Util