// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build details by details view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build the management view
router.get("/", utilities.handleErrors(invController.buildManagement));

//-- JUST FOR THE ADMINS OR EMPLOYEES --//

// Route to build the add-classification view
router.get("/add-classification", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddClassification));

// Route to build the add-inventory view
router.get("/add-inventory",utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddInventory));

// Route to get the inventory classification for the table on management view
router.get("/getInventory/:classification_id", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.getInventoryJSON))

// Route to build the edit inventory view 
router.get("/edit/:invId", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildEditInventoryById));

// Route to build the delete inventory view 
router.get("/delete/:invId", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildDeleteInventoryById));

//-- JUST FOR THE CLIENTS --//
// Route to build the favorites view 
router.get("/favorites/:accountId", utilities.checkClient, utilities.handleErrors(invController.buildFavorites));

// Process the add-classification data
router.post(
    "/add-classification",
    utilities.checkEmployeeOrAdmin,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.AddClassificationName)
)

// Process the add-inventory data
router.post(
    "/add-inventory",
    utilities.checkEmployeeOrAdmin,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.AddInventory)
)

// Process the edit-inventory data
router.post(
    "/edit-inventory",
    utilities.checkEmployeeOrAdmin,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Process the edit-inventory data
router.post(
    "/delete-confirm",
    utilities.checkEmployeeOrAdmin,
    utilities.handleErrors(invController.deleteInventory))

// Process add to favorites data
router.post(
    "/favorites/add",
    utilities.checkClient,
    utilities.handleErrors(invController.addFavorite))

// Process delete to favorites data
router.post(
    "/favorites/delete", 
    utilities.checkClient,
    utilities.handleErrors(invController.deleteFavorite))    

module.exports = router;