import { customers, items, orderDatabase } from "../db/DB.js";
import { OrderDto } from "../dto/OrderDto.js";
import { OrderDetailDto } from "../dto/OrderDetailDto.js";

function generateOrderID() {
  const orderCount = orderDatabase.length;
  const newOrderID = `O${String(orderCount + 1).padStart(3, "0")}`;
  return newOrderID;
}

function addOrder(orderData) {
  const newOrderID = generateOrderID();

  const order = new OrderDto(
    newOrderID,
    orderData.customerId,
    orderData.orderDate,
    orderData.items
  );

  orderDatabase.push(order);

  return newOrderID;
}

function getSelectedItems() {
  const orderItems = [];
  $("#order-detail-tbody tr").each(function () {
    const itemCode = $(this).find(".item-code").text();
    const itemQty = parseInt($(this).find(".order-qty").val());
    const item = items.find((i) => i.code === itemCode);
    if (item) {
      orderItems.push(new OrderDetailDto(item, itemQty));
    }
  });
  return orderItems;
}

function loadCustomers() {
  const customerSelect = $("#select-customer-id");
  customers.forEach((customer) => {
    const option = $("<option>").val(customer.id).text(customer.name);
    customerSelect.append(option);
  });
}

function loadItems() {
  const itemSelect = $("#select-item-code");
  items.forEach((item) => {
    const option = $("<option>").val(item.code).text(item.name);
    itemSelect.append(option);
  });
}

function updateCustomerDetails(customerId) {
  const customer = customers.find((c) => c.id === customerId);
  if (customer) {
    $("#txt-customer-id").val(customer.id);
    $("#txt-customer-name").val(customer.name);
    $("#txt-customer-address").val(customer.address);
    $("#txt-customer-salary").val(customer.salary);
  }
}

function updateItemDetails(itemCode) {
  const item = items.find((i) => i.code === itemCode);
  if (item) {
    $("#txt-item-code").val(item.code);
    $("#txt-item-name").val(item.name);
    $("#txt-item-price").val(item.price);
    $("#txt-item-qty").val(item.qtyOnHand);
  }
}

$("#order-form").on("submit", function (e) {
  e.preventDefault();

  const customerId = $("#select-customer-id").val();
  const orderDate = $("#txt-order-date").val();
  const orderItems = getSelectedItems();

  if (customerId && orderDate && orderItems.length > 0) {
    const newOrderId = addOrder({
      customerId,
      orderDate,
      items: orderItems,
    });

    $("#txt-order-id").val(newOrderId);
  } else {
    alert("Please fill in all fields properly before submitting the order.");
  }
});

$("#select-item-code").on("change", function () {
  const itemCode = $(this).val();
  updateItemDetails(itemCode);
});

$("#select-customer-id").on("change", function () {
  const customerId = $(this).val();
  updateCustomerDetails(customerId);
});

$("#add-item-btn").on("click", function () {
  const itemCode = $("#txt-item-code").val();
  const orderQty = parseInt($("#txt-order-qty").val());

  if (itemCode && orderQty > 0) {
    const item = items.find((i) => i.code === itemCode);

    if (item) {
      const itemRow = $("<tr>").html(`
        <td class="item-code">${item.code}</td>
        <td class="item-name">${item.name}</td>
        <td class="item-price">${item.price}</td>
        <td><input type="number" value="${orderQty}" class="order-qty form-control" /></td>
        <td class="item-total">${item.price * orderQty}</td>
        <td><button class="btn btn-danger remove-item-btn">Remove</button></td>
      `);

      $("#order-detail-tbody").append(itemRow);

      updateTotal();
    }
  } else {
    alert("Please select a valid item and quantity.");
  }
});

$("#order-detail-tbody").on("click", ".remove-item-btn", function () {
  $(this).closest("tr").remove();
  updateTotal();
});

function updateTotal() {
  let subtotal = 0;

  $("#order-detail-tbody tr").each(function () {
    const qty = parseInt($(this).find(".order-qty").val());
    const price = parseInt($(this).find(".item-price").text());
    const total = qty * price;

    $(this).find(".item-total").text(total);
    subtotal += total;
  });

  const discount = parseInt($("#txt-order-discount").val()) || 0;
  const cash = parseInt($("#txt-order-cash").val()) || 0;

  const total = subtotal - discount;

  $("#lbl-subtotal").text(`SubTotal: ${subtotal} Rs/=`);
  $("#lbl-total").text(`Total: ${total} Rs/=`);

  const balance = total - cash;
  $("#txt-order-balance").val(balance);
}

$("#txt-order-discount, #txt-order-cash").on("input", updateTotal);

$(document).ready(function () {
  loadCustomers();
  loadItems();
});
