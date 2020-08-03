using System;
using System.Collections.Generic;

namespace Core.Entities.OrderAggredate
{
    public class Order : BaseEntity
    {
        public Order()
        {

    }
    public Order(IReadOnlyList<OrderItem> orderItems, string buyerEmail, Address shipToAddress
    , DeliveryMethod deliveryMethod, decimal subTotal, string paymentIntentId)
    {
        this.BuyerEmail = buyerEmail;
        this.ShipToAddress = shipToAddress;
        this.DeliveryMethod = deliveryMethod;
        this.SubTotal = subTotal;
        this.OrderItems = orderItems;
        this.PaymentIntentId = paymentIntentId;
    }
    public string BuyerEmail { get; set; }
    public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;
    public Address ShipToAddress { get; set; }
    public DeliveryMethod DeliveryMethod { get; set; }
    public IReadOnlyList<OrderItem> OrderItems { get; set; }
    public decimal SubTotal { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public string PaymentIntentId { get; set; }
    public decimal GetTotal()
    {
        return SubTotal + DeliveryMethod.Price;
    }

}
}