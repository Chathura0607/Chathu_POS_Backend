export class OrderDto {
  constructor(orderId, customerId, date, total) {
    this.orderId = orderId;
    this.customerId = customerId;
    this.date = date;
    this.total = total;
    this.orderDetails = [];
  }

  addOrderDetail(orderDetail) {
    this.orderDetails.push(orderDetail);
  }
}
