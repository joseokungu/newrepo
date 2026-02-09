// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build details by details view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build the management view
router.get("/", utilities.handleErrors(invController.buildManagement));

//-- JUST FOR THE ADMINS OR EMPLOYEES --//

// Route to build the add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to build the add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Process the add-classification data
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.AddClassificationName)
)

// Process the add-inventory data
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    utilities.handleErrors(invController.AddInventory)
)


module.exports = router;