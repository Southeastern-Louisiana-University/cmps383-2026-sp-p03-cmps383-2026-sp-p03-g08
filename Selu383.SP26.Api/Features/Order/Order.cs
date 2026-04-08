namespace Selu383.SP26.Api.Features.Orders;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public decimal Total { get; set; }
    public string Status { get; set; } = "Pending";
    public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}