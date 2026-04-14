using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Features.Auth;
using Selu383.SP26.Api.Features.Menu;

namespace Selu383.SP26.Api.Controllers;

[ApiController]
[Route("api/menu")]
public class MenuController(DataContext dataContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<MenuItemDto>>> GetAll()
    {
        return await dataContext.MenuItems
            .Select(x => new MenuItemDto
            {
                Id = x.Id,
                Name = x.Name,
                Price = x.Price,
                Description = x.Description,
            })
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MenuItemDto>> GetById(int id)
    {
        var item = await dataContext.MenuItems.FindAsync(id);
        if (item == null) return NotFound();

        return Ok(new MenuItemDto
        {
            Id = item.Id,
            Name = item.Name,
            Price = item.Price,
            Description = item.Description,
        });
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult<MenuItemDto>> Create(MenuItemDto dto)
    {
        var item = new MenuItem
        {
            Name = dto.Name,
            Price = dto.Price,
            Description = dto.Description,
        };

        dataContext.MenuItems.Add(item);
        await dataContext.SaveChangesAsync();

        dto.Id = item.Id;
        return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult<MenuItemDto>> Update(int id, MenuItemDto dto)
    {
        var item = await dataContext.MenuItems.FindAsync(id);
        if (item == null) return NotFound();

        item.Name = dto.Name;
        item.Price = dto.Price;
        item.Description = dto.Description;

        await dataContext.SaveChangesAsync();

        dto.Id = item.Id;
        return Ok(dto);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult> Delete(int id)
    {
        var item = await dataContext.MenuItems.FindAsync(id);
        if (item == null) return NotFound();

        dataContext.MenuItems.Remove(item);
        await dataContext.SaveChangesAsync();

        return Ok();
    }
}
