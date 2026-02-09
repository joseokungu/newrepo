const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")

const validate = {}

/*  **********************************
  *  Add Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    body('classification_name')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .isAlphanumeric()
      .withMessage('The classification name must contain only letters and numbers, with no spaces or special characters.')
      .custom(async (classification_name) => {

        const classExists = await invModel.checkExistingClassification(classification_name)
        
        if (classExists) {
          throw new Error("Classification exists already. If you want to add a classificacion still, please choose another name.")
        }
      })
  ]
}

/*  **********************************
  *  Add Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
  return [
    // Classification
    body("classification_id")
      .trim()
      .isNumeric()
      .withMessage("Please select a valid classification."),

    // Make
    body("inv_make")
      .trim()
      .escape()
      .isLength({ min: 3, max: 20 })
      .matches(/^[A-Za-z]+[A-Za-z0-9\- ]$/)
      .withMessage("Make must be at least 3 characters and include only letters, spaces, or hyphens (-). Starting with a letter."),

    // Model
    body("inv_model")
      .trim()
      .escape()
      .isLength({ min: 3, max: 30 })
      .matches(/^[A-Za-z][A-Za-z0-9\- ]*$/)
      .withMessage("Model must be at least 3 characters and include only letters, numbers, spaces, or hyphens (-). Starting with a letter."),

    // Description
    body("inv_description")
      .trim()
      .escape()
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters long."), //So it is not empty.

    // Image Path
    body("inv_image")
      .trim()
      .matches(/^\/images\/vehicles\/.+\.(png|jpg|jpeg|webp)$/)
      .withMessage("Image path must be a valid file (/images/vehicles/example.png)."),

    // Thumbnail Path
    body("inv_thumbnail")
      .trim()
      .matches(/^\/images\/vehicles\/.+\.(png|jpg|jpeg|webp)$/)
      .withMessage("Thumbnail path must be a valid file (/images/vehicles/example.png)."),

    // Price
    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid positive number."),

    // Year
    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be a 4-digit value between 1900 and 2099."),

    // Miles
    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive whole number."),

    // Color
    body("inv_color")
      .trim()
      .escape()
      .isLength({ min: 3, max: 20 })
      .matches(/^[A-Za-z][A-Za-z ]*$/)
      .withMessage("Color must be at least 3 characters long(spaces allowed)."),
  ]
}


/* ******************************
 * Check data and return errors or continue to add new classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate