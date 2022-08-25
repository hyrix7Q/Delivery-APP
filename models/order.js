class Order {
  constructor(
    clientId,
    clientName,
    date,
    depart,
    destination,
    price,
    typeOfVehicle
  ) {
    this.clientId = clientId;
    this.clientName = clientName;
    this.date = date;
    this.depart = depart;
    this.destination = destination;
    this.price = price;
    this.typeOfVehicle = typeOfVehicle;
  }
}
export default Order;
