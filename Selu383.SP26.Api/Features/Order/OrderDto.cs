namespace Selu383.SP26.Api.Features.Orders;

public class OrderDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public class CreateOrderDto
{
    public List<OrderItemDto> Items { get; set; } = new();
    public decimal Total { get; set; }
}