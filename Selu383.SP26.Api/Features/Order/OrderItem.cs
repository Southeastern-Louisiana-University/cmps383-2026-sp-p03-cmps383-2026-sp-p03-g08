namespace Selu383.SP26.Api.Features.Orders;

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public virtual Order Order { get; set; } = null!;
}