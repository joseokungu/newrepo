const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicles details by details view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  // const account_id = 
  const inv_id = req.params.invId
  const data = await invModel.getDetailsByInventoryId(inv_id)
  const flex = await utilities.buildDetailsDisplay(data)
  let nav = await utilities.getNav()
  const vehicleName =`${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/details", {
    title: vehicleName,
    nav,
    flex,
    invId: inv_id,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()

  const classificationSelect = await utilities.buildClassificationList()

  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,
    classificationSelect: classificationSelect,
  })
}

/* ***************************
 *  Build add-classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add-inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
   const classificationList = await utilities.buildClassificationList(req.body);
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,
    classificationList: classificationList,
  })
}

/* ****************************************
*  Process Add Classification
* *************************************** */
invCont.AddClassificationName = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  
  const classResult = await invModel.AddNewClassification(classification_name)

  if (classResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve registered ${classification_name} as a new classification.`
    )
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, we couldn't add the classification.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
    })
  }
}

/* ****************************************
*  Process Add Inventory
* *************************************** */
invCont.AddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body;
  
  const invResult = await invModel.AddNewInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  )

  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve registered ${inv_make} ${inv_model} as a new vehicle in the inventory.`
    )
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, we couldn't add the vehicle to the inventory.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit-inventory view
 * ************************** */
invCont.buildEditInventoryById = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const data = await invModel.getDetailsByInventoryId(inv_id)
  const itemData = data[0]
  // console.log(data)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteInventoryById = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const data = await invModel.getDetailsByInventoryId(inv_id)
  const itemData = data[0]
  // console.log(data)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}


/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
  } = req.body

  const itemName = `${inv_make} ${inv_model}`


  const deleteResult = await invModel.deleteInventory(
    inv_id
  )

  if (!deleteResult) {
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

/* ***************************
 * Build favorites view
 * ************************** */
invCont.buildFavorites = async function (req, res, next) {
  const account_id = req.params.accountId

  const data = await invModel.getFavoritesByAccountId(account_id)
  const grid = await utilities.buildFavoriteTable(data)
  let nav = await utilities.getNav()


  res.render("./inventory/favorites", {
    title: "My Favorites",
    nav,
    grid: grid,
    errors: null
  })
}

/* ***************************************
 *  Process add vehicle to favorites
 * *************************************** */
invCont.addFavorite = async function (req, res) {
  const { account_id, inv_id } = req.body

  if (!account_id) {
    req.flash("notice", "Please log in to add favorites.")
    return res.redirect("/account/login")
  }

  const exist = await invModel.isFavorite(account_id, inv_id)

  if (!exist) {

    const result = await invModel.addFavorite(account_id, inv_id)

    if (!result) {
  req.flash("notice", "Vehicle added to your favorites.")

    }
  
  }

   else {
    req.flash("notice", "Vehicle already in your favorites.")
  }
  res.redirect(`/inv/detail/${inv_id}`)
}

/* ***************************
 * Delete a vehicle from favorites
 * ************************** */
invCont.deleteFavorite = async function (req, res) {
  const { account_id, inv_id } = req.body


  if (!account_id) {
    req.flash("notice", "You must be logged in to modify favorites.")
    return res.redirect("/account/login")
  }

  const result = await invModel.deleteFavorite(account_id, inv_id)

  if (!result) {
    req.flash("notice", "Vehicle removed from favorites.")
  } else {
    req.flash("notice", "Unable to remove the vehicle from favorites.")
  }


  res.redirect(`/inv/favorites/${account_id}`)
}


module.exports = invCont