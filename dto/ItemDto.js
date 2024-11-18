export class ItemDto {
  constructor(code, name, price, quantity) {
    if (this.validate(code, name, price, quantity)) {
      this.code = code;
      this.name = name;
      this.price = price;
      this.quantity = quantity;
    } else {
      throw new Error("Invalid Item Data");
    }
  }

  validate(code, name, price, quantity) {
    return (
      this.validateCode(code) &&
      this.validateName(name) &&
      this.validatePrice(price) &&
      this.validateQuantity(quantity)
    );
  }

  validateCode(code) {
    return /^[A-Za-z0-9]+$/.test(code);
  }

  validateName(name) {
    return name.trim().length >= 2;
  }

  validatePrice(price) {
    return price > 0;
  }

  validateQuantity(quantity) {
    return quantity >= 0;
  }
}
