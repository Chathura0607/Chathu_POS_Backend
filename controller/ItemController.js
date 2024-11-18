import { ItemDto } from "../dto/ItemDto.js";
import {
  getAllItems,
  addItem,
  removeItem,
  updateItem,
  isItemExist,
} from "../model/ItemModel.js";

$(document).ready(() => {
  loadAllItems();
  generateNextItemCode();

  $("#saveItemBtn").click(saveItem);
  $("#renewItemBtn").click(updateItemHandler);
  $("#deleteItemBtn").click(deleteItem);
  $("#viewAllItemsBtn").click(loadAllItems);
  $("#searchItemBtn").click(searchItem);

  $("#item-table-body").on("click", "td", function () {
    const row = $(this).parent();
    populateFieldsFromRow(row);
  });

  $("#clearItemBtn").click(clearFields);
});

function loadAllItems() {
  clearTable();
  getAllItems().forEach((item) => reloadTable(item));
}

function saveItem() {
  if (!validateItemForm()) return;

  const code = $("#itemCode").val().trim();
  const name = $("#itemName").val().trim();
  const price = parseFloat($("#itemPrice").val());
  const quantity = parseInt($("#itemQuantity").val());

  if (!isItemExist(code)) {
    const item = new ItemDto(code, name, price, quantity);
    try {
      addItem(item);
      loadAllItems();
      clearFields();
      generateNextItemCode();
      alert("Item Added Successfully!");
    } catch (error) {
      alert("Error Adding Item: " + error.message);
    }
  } else {
    alert("Item Code Already Exists!");
  }
}

function updateItemHandler() {
  if (!validateItemForm()) {
    return;
  }

  const code = $("#itemCode").val().trim();
  const name = $("#itemName").val().trim();
  const price = parseFloat($("#itemPrice").val());
  const quantity = parseInt($("#itemQuantity").val());

  if (isItemExist(code)) {
    const updatedItem = new ItemDto(code, name, price, quantity);
    try {
      updateItem(updatedItem);
      loadAllItems();
      clearFields();
      alert("Item Updated Successfully!");
    } catch (error) {
      alert("Error Updating Item: " + error.message);
    }
  } else {
    alert("Item Not Found!");
  }
}

function deleteItem() {
  const code = $("#itemCode").val().trim();

  if (isItemExist(code)) {
    try {
      removeItem(code);
      loadAllItems();
      clearFields();
      generateNextItemCode();
      alert("Item Deleted Successfully!");
    } catch (error) {
      alert("Error Deleting Item: " + error.message);
    }
  } else {
    alert("Item Not Found!");
  }
}

function searchItem() {
  const searchValue = $("#searchItem").val().toLowerCase();
  const searchBy = $("#searchItemBy").val();

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

function populateFieldsFromRow(row) {
  $("#itemCode").val(row.children().eq(0).text());
  $("#itemName").val(row.children().eq(1).text());
  $("#itemPrice").val(row.children().eq(2).text());
  $("#itemQuantity").val(row.children().eq(3).text());
}

function generateNextItemCode() {
  const items = getAllItems();
  const lastItem = items[items.length - 1];
  const lastCode = lastItem ? lastItem.code : "I000";

  const numberPart = parseInt(lastCode.slice(1)) + 1;

  const nextCode = "I" + numberPart.toString().padStart(3, "0");
  $("#itemCode").val(nextCode);
}

function clearFields() {
  $("#itemForm")[0].reset();
  $("#searchItem").val("");
  generateNextItemCode();

  clearError("itemCodeError");
  clearError("itemNameError");
  clearError("itemPriceError");
  clearError("itemQuantityError");
}

function clearTable() {
  $("#item-table-body").empty();
}

function reloadTable(item) {
  const row = `
    <tr>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.quantity}</td>
    </tr>`;
  $("#item-table-body").append(row);
}

function validateItemForm() {
  let isValid = true;

  const code = $("#itemCode").val().trim();
  const name = $("#itemName").val().trim();
  const price = $("#itemPrice").val().trim();
  const quantity = $("#itemQuantity").val().trim();

  if (!/^[A-Za-z0-9]+$/.test(code)) {
    showError(
      "itemCodeError",
      "Item Code must contain only letters and numbers."
    );
    isValid = false;
  } else {
    clearError("itemCodeError");
  }

  if (name.length < 2) {
    showError("itemNameError", "Item Name must be at least 2 characters long.");
    isValid = false;
  } else {
    clearError("itemNameError");
  }

  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    showError("itemPriceError", "Price must be a positive number.");
    isValid = false;
  } else {
    clearError("itemPriceError");
  }

  if (!quantity || isNaN(quantity) || parseInt(quantity) < 0) {
    showError("itemQuantityError", "Quantity must be a non-negative integer.");
    isValid = false;
  } else {
    clearError("itemQuantityError");
  }

  return isValid;
}

function showError(elementId, message) {
  $("#" + elementId).text(message);
}

function clearError(elementId) {
  $("#" + elementId).text("");
}
