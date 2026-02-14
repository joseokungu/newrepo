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

// Route to get the inventory classification for the table on management view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build the delete inventory view 
router.get("/delete/:invId", utilities.handleErrors(invController.buildDeleteInventoryById));

// Route to build the edit inventory view 
router.get("/edit/:invId", utilities.handleErrors(invController.buildEditInventoryById));

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

// Process the edit-inventory data
router.post(
    "/edit-inventory",
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Process the edit-inventory data
router.post(
    "/delete-confirm",
    utilities.handleErrors(invController.deleteInventory))

module.exports = router;