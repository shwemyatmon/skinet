namespace Core.Entities.OrderAggredate
{
    public class OrderItem : BaseEntity
    {
        public OrderItem()
        {
            
        }
        public OrderItem(ProductItemOrdered itemOrdered,decimal price, int quantity)
        {
            this.ItemOrdered = itemOrdered;
            this.Quantity = quantity;
            this.Price = price;

        }
        public ProductItemOrdered ItemOrdered { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}