import { CustomerDto } from "../dto/CustomerDto.js";
import { ItemDto } from "../dto/ItemDto.js";

export const customers = [
  new CustomerDto("C00-001", "Amal Kariyawasam", "123 Main St", "0751234567"),
  new CustomerDto("C00-002", "Ruwan Hewage", "456 Elm St", "0779876543"),
];

export let items = [
  new ItemDto("I001", "Keerisamba", 300, 55),
  new ItemDto("I002", "Sugar", 100, 20),
];
