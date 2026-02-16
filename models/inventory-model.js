const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getDetailsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getinventorybyid error " + error)
  }
}

/* *****************************
*   Add New Classification
* *************************** */
async function AddNewClassification(classification_name){
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const className = await pool.query(sql, [classification_name])
    return className.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Add New Inventory
* *************************** */
async function AddNewInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color){
  try {
    const sql = "INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, $10) RETURNING *"
    return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql =
      "DELETE FROM public.inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("Delete Inventory Error")
  }
}

/* ***************************
 *  Get all favorites for a user
 * ************************** */
async function getFavoritesByAccountId(account_id) {
  try {
    const data = await pool.query(
      `SELECT f.account_id, f.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_thumbnail, i.inv_price 
     FROM public.favorites f
     JOIN public.inventory i ON f.inv_id = i.inv_id
     WHERE f.account_id = $1`,
    [account_id]
    )
    return data.rows
  } catch (error) {
    console.error("getfavoritebyid error " + error)
  }
}

/* ***************************
 *  Add to favorites for a user
 * ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = "INSERT INTO public.favorites (account_id, inv_id) VALUES ($1, $2) RETURNING *"

    data = await pool.query(sql, [account_id, inv_id])

  } catch (error) {
    return error.message
  }
}

async function isFavorite(account_id, inv_id) {
  try {
    const sql = "SELECT favorite_id FROM public.favorites WHERE account_id = $1 AND inv_id = $2"

    const data = await pool.query(sql, [account_id, inv_id])

    if (data.rows[0]) {
      return true
    } else {
      return false
    }

  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Remove from favorites for a user
 * ************************** */
async function deleteFavorite(account_id, inv_id) {
  try {
    const sql =
      "DELETE FROM public.favorites WHERE account_id = $1 AND inv_id = $2"
    const data = await pool.query(sql, [account_id, inv_id])
    
    return data.rows[0]
  } catch (error) {
    console.error("Delete Inventory Error")
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getDetailsByInventoryId, checkExistingClassification, AddNewClassification, AddNewInventory, updateInventory, deleteInventory, getFavoritesByAccountId, addFavorite, deleteFavorite, isFavorite};
