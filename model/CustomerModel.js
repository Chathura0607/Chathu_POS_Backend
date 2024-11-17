import { customers } from "../db/DB.js";
import { CustomerDto } from "../dto/CustomerDto.js";

export function getAllCustomers() {
  return customers;
}

export function addCustomer(customer) {
  if (customer instanceof CustomerDto && !isCustomerExist(customer.id)) {
    customers.push(customer);
  } else {
    throw new Error("Invalid Customer or Customer Already Exists");
  }
}

export function removeCustomer(id) {
  const index = customers.findIndex((customer) => customer.id === id);
  if (index !== -1) {
    customers.splice(index, 1);
  } else {
    throw new Error("Customer Not Found");
  }
}

export function updateCustomer(updatedCustomer) {
  const index = customers.findIndex(
    (customer) => customer.id === updatedCustomer.id
  );
  if (index !== -1) {
    customers[index] = updatedCustomer;
  } else {
    throw new Error("Customer Not Found");
  }
}

export function isCustomerExist(id) {
  return customers.some((customer) => customer.id === id);
}
