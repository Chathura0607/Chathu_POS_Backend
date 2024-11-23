// OrderModel.js
import { orderDatabase, items, customers } from "../db/DB.js";
import { OrderDto } from "../dto/OrderDto.js";
import { OrderDetailDto } from "../dto/OrderDetailDto.js";

export const getCustomers = () => customers;

export const getItems = () => items;

export const saveOrder = (order) => {
  orderDatabase.push(order);
};

export const getOrderById = (orderId) => {
  return orderDatabase.find((order) => order.orderId === orderId);
};

export const createOrder = (orderData) => {
  const { orderId, date, customerId, discount, cash, orderDetails } = orderData;

  const customer = customers.find((c) => c.id === customerId);
  if (!customer) {
    throw new Error("Customer not found!");
  }

  const details = orderDetails.map((detail) => {
    const item = items.find((i) => i.code === detail.itemCode);
    if (!item) {
      throw new Error(`Item with code ${detail.itemCode} not found!`);
    }
    return new OrderDetailDto(item.code, item.name, item.price, detail.qty);
  });

  const order = new OrderDto(
    orderId,
    date,
    customerId,
    discount,
    cash,
    cash - discount,
    details
  );
  saveOrder(order);
  return order;
};
