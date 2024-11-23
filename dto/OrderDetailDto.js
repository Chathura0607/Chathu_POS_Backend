// OrderDetailDto.js
export class OrderDetailDto {
  constructor(itemCode, itemName, itemPrice, qty) {
    this.itemCode = itemCode;
    this.itemName = itemName;
    this.itemPrice = itemPrice;
    this.qty = qty;
    this.total = itemPrice * qty;
  }
}
