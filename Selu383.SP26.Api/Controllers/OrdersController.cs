using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Features.Auth;
using Selu383.SP26.Api.Features.Orders;

namespace Selu383.SP26.Api.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly DataContext dbContext;
    private readonly UserManager<User> userManager;

    public OrdersController(DataContext dbContext, UserManager<User> userManager)
    {
        this.dbContext = dbContext;
        this.userManager = userManager;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto dto)
    {
        var user = await userManager.FindByNameAsync(User.Identity!.Name!);
        if (user == null) return Unauthorized();

        var location = await dbContext.Locations.FindAsync(dto.LocationId);
        if (location == null) return BadRequest("Invalid location.");

        var order = new Order
        {
            UserId = user.Id,
            LocationId = dto.LocationId,
            Total = dto.Total,
            Items = dto.Items.Select(i => new OrderItem { Name = i.Name, Price = i.Price }).ToList()
        };

        dbContext.Orders.Add(order);

        var userPoints = await dbContext.UserPoints.FirstOrDefaultAsync(x => x.UserId == user.Id);
        if (userPoints == null)
        {
            userPoints = new UserPoints { UserId = user.Id, Points = (int)(dto.Total * 10) };
            dbContext.UserPoints.Add(userPoints);
        }
        else
        {
            userPoints.Points += (int)(dto.Total * 10);
        }

        await dbContext.SaveChangesAsync();
        return Ok(await GetOrderDto(order.Id));
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<List<OrderDto>>> GetMyOrders()
    {
        var user = await userManager.FindByNameAsync(User.Identity!.Name!);
        if (user == null) return Unauthorized();

        var orders = await dbContext.Orders
            .Include(o => o.Items)
            .Where(o => o.UserId == user.Id)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                UserId = o.UserId,
                UserName = user.UserName!,
                LocationId = o.LocationId,
                LocationName = dbContext.Locations.Where(l => l.Id == o.LocationId).Select(l => l.Name).FirstOrDefault() ?? "",
                CreatedAt = o.CreatedAt,
                Total = o.Total,
                Status = o.Status,
                Items = o.Items.Select(i => new OrderItemDto { Name = i.Name, Price = i.Price }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet]
    [Authorize(Roles = "Staff,Admin,Manager")]
    public async Task<ActionResult<List<OrderDto>>> GetAllOrders()
    {
        var currentUser = await userManager.FindByNameAsync(User.Identity!.Name!);
        if (currentUser == null) return Unauthorized();

        var roles = await userManager.GetRolesAsync(currentUser);
        var isAdmin = roles.Contains(RoleNames.Admin);

        var query = dbContext.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .AsQueryable();

        // Staff and manager only see orders for their location
        if (!isAdmin && currentUser.LocationId.HasValue)
        {
            query = query.Where(o => o.LocationId == currentUser.LocationId.Value);
        }

        var orders = await query
            .Select(o => new OrderDto
            {
                Id = o.Id,
                UserId = o.UserId,
                UserName = dbContext.Users.Where(u => u.Id == o.UserId).Select(u => u.UserName).FirstOrDefault() ?? "",
                LocationId = o.LocationId,
                LocationName = dbContext.Locations.Where(l => l.Id == o.LocationId).Select(l => l.Name).FirstOrDefault() ?? "",
                CreatedAt = o.CreatedAt,
                Total = o.Total,
                Status = o.Status,
                Items = o.Items.Select(i => new OrderItemDto { Name = i.Name, Price = i.Price }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
        }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Staff,Admin")]
    public async Task<ActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var order = await dbContext.Orders.FindAsync(id);
        if (order == null) return NotFound();
        order.Status = status;
        await dbContext.SaveChangesAsync();
        return Ok();
    }

    private async Task<OrderDto> GetOrderDto(int orderId)
    {
        return await dbContext.Orders
            .Include(o => o.Items)
            .Where(o => o.Id == orderId)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                UserId = o.UserId,
                UserName = dbContext.Users.Where(u => u.Id == o.UserId).Select(u => u.UserName).FirstOrDefault() ?? "",
                LocationId = o.LocationId,
                LocationName = dbContext.Locations.Where(l => l.Id == o.LocationId).Select(l => l.Name).FirstOrDefault() ?? "",
                CreatedAt = o.CreatedAt,
                Total = o.Total,
                Status = o.Status,
                Items = o.Items.Select(i => new OrderItemDto { Name = i.Name, Price = i.Price }).ToList()
            })
            .FirstAsync();
    }
}