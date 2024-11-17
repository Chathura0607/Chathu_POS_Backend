import { CustomerDto } from "../dto/CustomerDto.js";
import {
  getAllCustomers,
  addCustomer,
  removeCustomer,
  updateCustomer,
  isCustomerExist,
} from "../model/CustomerModel.js";

document.addEventListener("DOMContentLoaded", () => {
  loadAllCustomers();
  generateNextCustomerID();

  document
    .getElementById("saveCustomerBtn")
    .addEventListener("click", saveCustomer);
  document
    .getElementById("deleteBtn")
    .addEventListener("click", deleteCustomer);
  document
    .getElementById("renewBtn")
    .addEventListener("click", updateCustomerHandler);
  document
    .getElementById("viewAllBtn")
    .addEventListener("click", loadAllCustomers);
  document
    .getElementById("searchBtn")
    .addEventListener("click", searchCustomer);

  document
    .getElementById("cus-table-body")
    .addEventListener("click", (event) => {
      if (event.target.tagName === "TD") {
        const row = event.target.parentNode;
        populateFieldsFromRow(row);
      }
    });

  document.getElementById("clearBtn").addEventListener("click", () => {
    clearFields();
  });
});

function loadAllCustomers() {
  clearTable();
  getAllCustomers().forEach((customer) => reloadTable(customer));
}

function saveCustomer() {
  if (!validateCustomerForm()) {
    return;
  }

  const id = document.getElementById("cus-ID").value;
  const name = document.getElementById("cus-name").value;
  const address = document.getElementById("cus-address").value;
  const mobile = document.getElementById("cus-mobile").value;

  if (!isCustomerExist(id)) {
    const customer = new CustomerDto(id, name, address, mobile);

    try {
      addCustomer(customer);
      loadAllCustomers();
      clearFields();
      generateNextCustomerID();
      alert("Customer Added Successfully!");
    } catch (error) {
      alert("Error Adding Customer: " + error.message);
    }
  } else {
    alert("Customer ID already exists!");
  }
}

function updateCustomerHandler() {
  if (!validateCustomerForm()) {
    return;
  }

  const id = document.getElementById("cus-ID").value;
  const name = document.getElementById("cus-name").value;
  const address = document.getElementById("cus-address").value;
  const mobile = document.getElementById("cus-mobile").value;

  if (isCustomerExist(id)) {
    const customer = new CustomerDto(id, name, address, mobile);

    try {
      updateCustomer(customer);
      loadAllCustomers();
      clearFields();
      alert("Customer Updated Successfully!");
    } catch (error) {
      alert("Error Updating Customer: " + error.message);
    }
  } else {
    alert("Customer Not Found!");
  }
}

function deleteCustomer() {
  const id = document.getElementById("cus-ID").value;

  if (isCustomerExist(id)) {
    removeCustomer(id);
    loadAllCustomers();
    clearFields();
    alert("Customer Deleted Successfully!");
  } else {
    alert("Customer Not Found!");
  }
}

function searchCustomer() {
  const searchValue = document
    .getElementById("searchCustomer")
    .value.toLowerCase();
  const searchBy = document.getElementById("searchBy").value;

  const filteredCustomers = getAllCustomers().filter((customer) =>
    searchBy === "name"
      ? customer.name.toLowerCase().includes(searchValue)
      : customer.mobile.includes(searchValue)
  );

  clearTable();
  if (filteredCustomers.length > 0) {
    filteredCustomers.forEach((customer) => reloadTable(customer));
  } else {
    alert("No matching customers found!");
  }
}

function populateFieldsFromRow(row) {
  document.getElementById("cus-ID").value = row.cells[0].textContent;
  document.getElementById("cus-name").value = row.cells[1].textContent;
  document.getElementById("cus-address").value = row.cells[2].textContent;
  document.getElementById("cus-mobile").value = row.cells[3].textContent;
}

function generateNextCustomerID() {
  const customers = getAllCustomers();
  const lastCustomer = customers[customers.length - 1];
  const lastID = lastCustomer ? lastCustomer.id : "C00-000";

  const idParts = lastID.split("-");
  const nextID = `${idParts[0]}-${(parseInt(idParts[1]) + 1)
    .toString()
    .padStart(3, "0")}`;
  document.getElementById("cus-ID").value = nextID;
}

function clearFields() {
  document.getElementById("customerForm").reset();

  document.getElementById("searchCustomer").value = "";

  generateNextCustomerID();

  document.getElementById("cus-ID-error").textContent = "";
  document.getElementById("cus-name-error").textContent = "";
  document.getElementById("cus-address-error").textContent = "";
  document.getElementById("cus-mobile-error").textContent = "";
}

function clearTable() {
  document.getElementById("cus-table-body").innerHTML = "";
}

function reloadTable(customer) {
  const tableBody = document.getElementById("cus-table-body");
  const row = `
    <tr>
      <td>${customer.id}</td>
      <td>${customer.name}</td>
      <td>${customer.address}</td>
      <td>${customer.mobile}</td>
    </tr>`;
  tableBody.innerHTML += row;
}

function validateCustomerForm() {
  let isValid = true;

  const id = document.getElementById("cus-ID").value.trim();
  const name = document.getElementById("cus-name").value.trim();
  const address = document.getElementById("cus-address").value.trim();
  const mobile = document.getElementById("cus-mobile").value.trim();

  if (!/^C\d{2}-\d{3}$/.test(id)) {
    showError("cus-ID-error", "Customer ID must follow the format C00-001");
    isValid = false;
  } else {
    clearError("cus-ID-error");
  }

  if (!name || !/^[a-zA-Z\s]+$/.test(name)) {
    showError(
      "cus-name-error",
      "Customer Name can only contain letters and spaces."
    );
    isValid = false;
  } else {
    clearError("cus-name-error");
  }

  if (!address || address.length < 5) {
    showError(
      "cus-address-error",
      "Address must be at least 5 characters long."
    );
    isValid = false;
  } else {
    clearError("cus-address-error");
  }

  if (!/^\d{10}$/.test(mobile)) {
    showError("cus-mobile-error", "Mobile number must be exactly 10 digits.");
    isValid = false;
  } else {
    clearError("cus-mobile-error");
  }

  return isValid;
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
}

function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = "";
}
