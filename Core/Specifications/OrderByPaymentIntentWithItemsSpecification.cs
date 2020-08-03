using Core.Entities.OrderAggredate;

namespace Core.Specifications
{
    public class OrderByPaymentIntentSpecification : BaseSpecification<Order>
    {
        public OrderByPaymentIntentSpecification(string paymentIntentId): base(
            o => o.PaymentIntentId == paymentIntentId
        )
        {
            
        }
    }
}