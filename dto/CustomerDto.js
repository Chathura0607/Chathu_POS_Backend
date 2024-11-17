export class CustomerDto {
  constructor(id, name, address, mobile) {
    if (this.validate(id, name, address, mobile)) {
      this.id = id;
      this.name = name;
      this.address = address;
      this.mobile = mobile;
    } else {
      throw new Error("Invalid Customer Data");
    }
  }

  validate(id, name, address, mobile) {
    return (
      /^C\d{2}-\d{3}$/.test(id) &&
      /^[a-zA-Z\s]+$/.test(name) &&
      address.length >= 5 &&
      /^\d{10}$/.test(mobile)
    );
  }
}
