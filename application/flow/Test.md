# Order product 2

* Form `Order` 22
* Reservation
  * `+` Notify "Reservation was successful"
  * `-` Notify "The product is out of stock"
* Form `Payment`
* Payment 22
  * `+` Notify "Payment was successful"
  * `<` Return payment
* Pick up from the warehouse
  * `<` Return to the warehouse
* Shipping by carrier
  * `+` Notify "The product was successfully sent"
  * `-` Notify "The product was not sent"
* Finalization
  * `+` Notify "Please provide product feedback"
  * `+` Notify "Please provide service feedback"

# Reservation

* `getStockBalance(Order): Balance`
* `checkStockBalance(Order, Balance): Availability`
* `makeReservation(Order, Balance, Availability): Reservation`

# Pick up from the warehouse

* `pickProduct(Order): Package`
  * `-` `removeReservation(Reservation): Reservation`

# Return to the warehouse

* `returnProduct(Package): Return`

# Payment

* `makePayment(Order): Payment`

# Return payment

* `refundPayment(Payment): Refund`

# Shipping by carrier

* `selectCarrier(Order): Carrier`
* `makeShipment(Package, Carrier): Shipment`
