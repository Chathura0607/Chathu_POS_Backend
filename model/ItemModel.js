import { items } from "../db/DB.js";
import { ItemDto } from "../dto/ItemDto.js";

export function getAllItems() {
  return items;
}

export function addItem(item) {
  if (item instanceof ItemDto && !isItemExist(item.code)) {
    items.push(item);
  } else {
    throw new Error("Invalid Item or Item Already Exists");
  }
}

export function removeItem(code) {
  const index = items.findIndex((item) => item.code === code);
  if (index !== -1) {
    items.splice(index, 1);
  } else {
    throw new Error("Item Not Found");
  }
}

export function updateItem(updatedItem) {
  const index = items.findIndex((item) => item.code === updatedItem.code);
  if (index !== -1) {
    items[index] = updatedItem;
  } else {
    throw new Error("Item Not Found");
  }
}

export function isItemExist(code) {
  return items.some((item) => item.code === code);
}
