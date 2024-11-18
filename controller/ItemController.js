import { ItemDto } from "../dto/ItemDto.js";
import {
  getAllItems,
  addItem,
  removeItem,
  updateItem,
  isItemExist,
} from "../model/ItemModel.js";

document.addEventListener("DOMContentLoaded", () => {
  loadAllItems();
  generateNextItemCode();

  document.getElementById("saveItemBtn").addEventListener("click", saveItem);
  document
    .getElementById("renewItemBtn")
    .addEventListener("click", updateItemHandler);
  document
    .getElementById("deleteItemBtn")
    .addEventListener("click", deleteItem);
  document
    .getElementById("viewAllItemsBtn")
    .addEventListener("click", loadAllItems);
  document
    .getElementById("searchItemBtn")
    .addEventListener("click", searchItem);

  document
    .getElementById("item-table-body")
    .addEventListener("click", (event) => {
      if (event.target.tagName === "TD") {
        const row = event.target.parentNode;
        populateFieldsFromRow(row);
      }
    });

  document.getElementById("clearItemBtn").addEventListener("click", () => {
    clearFields();
  });
});

// Load all items into the table
function loadAllItems() {
  clearTable();
  getAllItems().forEach((item) => reloadTable(item));
}

// Save item
function saveItem() {
  if (!validateItemForm()) return; // Stop if validation fails

  const code = document.getElementById("itemCode").value.trim();
  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);
  const quantity = parseInt(document.getElementById("itemQuantity").value);

  if (!isItemExist(code)) {
    const item = new ItemDto(code, name, price, quantity);
    try {
      addItem(item); // Add item to the database
      loadAllItems(); // Reload table
      clearFields(); // Reset form
      generateNextItemCode(); // Generate the next item code
      alert("Item Added Successfully!");
    } catch (error) {
      alert("Error Adding Item: " + error.message);
    }
  } else {
    alert("Item Code Already Exists!");
  }
}

// Update item
function updateItemHandler() {
  if (!validateItemForm()) {
    return;
  }

  const code = document.getElementById("itemCode").value.trim();
  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);
  const quantity = parseInt(document.getElementById("itemQuantity").value);

  if (isItemExist(code)) {
    const updatedItem = new ItemDto(code, name, price, quantity);
    try {
      updateItem(updatedItem); // Update the item in the database
      loadAllItems(); // Refresh table
      clearFields(); // Reset form
      alert("Item Updated Successfully!");
    } catch (error) {
      alert("Error Updating Item: " + error.message);
    }
  } else {
    alert("Item Not Found!");
  }
}

// Delete item
function deleteItem() {
  const code = document.getElementById("itemCode").value.trim();

  if (isItemExist(code)) {
    try {
      removeItem(code); // Remove item from database
      loadAllItems(); // Refresh table
      clearFields(); // Reset form
      generateNextItemCode(); // Generate the next item code
      alert("Item Deleted Successfully!");
    } catch (error) {
      alert("Error Deleting Item: " + error.message);
    }
  } else {
    alert("Item Not Found!");
  }
}

// Search items
function searchItem() {
  const searchValue = document.getElementById("searchItem").value.toLowerCase();
  const searchBy = document.getElementById("searchItemBy").value;

  const filteredItems = getAllItems().filter((item) =>
    searchBy === "name"
      ? item.name.toLowerCase().includes(searchValue)
      : item.code.toLowerCase().includes(searchValue)
  );

  clearTable();
  if (filteredItems.length > 0) {
    filteredItems.forEach((item) => reloadTable(item));
  } else {
    alert("No Matching Items Found!");
  }
}

// Populate form fields from a selected table row
function populateFieldsFromRow(row) {
  document.getElementById("itemCode").value = row.cells[0].textContent;
  document.getElementById("itemName").value = row.cells[1].textContent;
  document.getElementById("itemPrice").value = row.cells[2].textContent;
  document.getElementById("itemQuantity").value = row.cells[3].textContent;
}

// Generate the next item code
function generateNextItemCode() {
  const items = getAllItems();
  const lastItem = items[items.length - 1];
  const lastCode = lastItem ? lastItem.code : "I000";

  // Extract the numeric part of the code and increment it
  const numberPart = parseInt(lastCode.slice(1)) + 1;

  // Generate the next code
  const nextCode = "I" + numberPart.toString().padStart(3, "0");
  document.getElementById("itemCode").value = nextCode;
}

// Clear form fields
function clearFields() {
  // Reset the form fields
  document.getElementById("itemForm").reset();

  // Clear the search field
  document.getElementById("searchItem").value = ""; // Explicitly clear the search field

  // Generate the next item code
  generateNextItemCode();

  // Clear all error messages
  clearError("itemCodeError").textContent = "";
  clearError("itemNameError").textContent = "";
  clearError("itemPriceError").textContent = "";
  clearError("itemQuantityError").textContent = "";
}

// Clear the table body
function clearTable() {
  document.getElementById("item-table-body").innerHTML = "";
}

// Reload the table with a single item
function reloadTable(item) {
  const tableBody = document.getElementById("item-table-body");
  const row = `
    <tr>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.quantity}</td>
    </tr>`;
  tableBody.innerHTML += row;
}

// Validate item form
function validateItemForm() {
  let isValid = true;

  const code = document.getElementById("itemCode").value.trim();
  const name = document.getElementById("itemName").value.trim();
  const price = document.getElementById("itemPrice").value.trim();
  const quantity = document.getElementById("itemQuantity").value.trim();

  // Validate code
  if (!/^[A-Za-z0-9]+$/.test(code)) {
    showError(
      "itemCodeError",
      "Item Code must contain only letters and numbers."
    );
    isValid = false;
  } else {
    clearError("itemCodeError");
  }

  // Validate name
  if (name.length < 2) {
    showError("itemNameError", "Item Name must be at least 2 characters long.");
    isValid = false;
  } else {
    clearError("itemNameError");
  }

  // Validate price
  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    showError("itemPriceError", "Price must be a positive number.");
    isValid = false;
  } else {
    clearError("itemPriceError");
  }

  // Validate quantity
  if (!quantity || isNaN(quantity) || parseInt(quantity) < 0) {
    showError("itemQuantityError", "Quantity must be a non-negative integer.");
    isValid = false;
  } else {
    clearError("itemQuantityError");
  }

  return isValid;
}

// Show an error message
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
}

// Clear an error message
function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = "";
}
