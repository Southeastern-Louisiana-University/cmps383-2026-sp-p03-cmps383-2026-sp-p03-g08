using System.Transactions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP26.Api.Features.Auth;
using Microsoft.EntityFrameworkCore;
using Selu383.SP26.Api.Data;

namespace Selu383.SP26.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly UserManager<User> userManager;
    private readonly DataContext dbContext;

    public UsersController(UserManager<User> userManager, DataContext dbContext)
    {
        this.userManager = userManager;
        this.dbContext = dbContext;
    }

    [HttpGet]
    [Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult<List<UserDto>>> GetAll()
    {
        var users = await userManager.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .ToListAsync();

        var result = new List<UserDto>();
        foreach (var user in users)
        {
            var points = await dbContext.UserPoints.FirstOrDefaultAsync(x => x.UserId == user.Id);
            result.Add(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName!,
                Roles = user.UserRoles.Select(ur => ur.Role.Name!).ToArray(),
                Points = points?.Points ?? 0,
            });
        }

        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult<UserDto>> GetById(int id)
    {
        var user = await userManager.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return NotFound();

        var points = await dbContext.UserPoints.FirstOrDefaultAsync(x => x.UserId == user.Id);
        return Ok(new UserDto
        {
            Id = user.Id,
            UserName = user.UserName!,
            Roles = user.UserRoles.Select(ur => ur.Role.Name!).ToArray(),
            Points = points?.Points ?? 0,
        });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult> Delete(int id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        var result = await userManager.DeleteAsync(user);
        if (!result.Succeeded) return BadRequest();

        return Ok();
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult<UserDto>> Create(CreateUserDto dto)
    {
        using var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

        var newUser = new User
        {
            UserName = dto.UserName,
        };
        var createResult = await userManager.CreateAsync(newUser, dto.Password);
        if (!createResult.Succeeded)
        {
            return BadRequest();
        }

        try
        {
            var roleResult = await userManager.AddToRolesAsync(newUser, dto.Roles);
            if (!roleResult.Succeeded)
            {
                return BadRequest();
            }
        }
        catch (InvalidOperationException e) when(e.Message.StartsWith("Role") && e.Message.EndsWith("does not exist."))
        {
            return BadRequest();
        }

        transaction.Complete();

        return Ok(new UserDto
        {
            Id = newUser.Id,
            Roles = dto.Roles,
            UserName = newUser.UserName,
        });
    }

    [HttpGet("points")]
    [Authorize]
    public async Task<ActionResult<int>> GetPoints()
    {
        var userName = User.Identity!.Name;
        var user = await userManager.FindByNameAsync(userName!);
        if (user == null) return NotFound();

        var userPoints = await dbContext.UserPoints.FirstOrDefaultAsync(x => x.UserId == user.Id);
        return Ok(userPoints?.Points ?? 0);
    }

    [HttpPost("points/add")]
    [Authorize]
    public async Task<ActionResult<int>> AddPoints([FromBody] int points)
    {
        var userName = User.Identity!.Name;
        var user = await userManager.FindByNameAsync(userName!);
        if (user == null) return NotFound();

        var userPoints = await dbContext.UserPoints.FirstOrDefaultAsync(x => x.UserId == user.Id);
        if (userPoints == null)
        {
            userPoints = new UserPoints { UserId = user.Id, Points = points };
            dbContext.UserPoints.Add(userPoints);
        }
        else
        {
            userPoints.Points += points;
        }

        await dbContext.SaveChangesAsync();
        return Ok(userPoints.Points);
    }

    [HttpPost("{userName}/roles")]
    [Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult> SetRole(string userName, [FromBody] string role)
    {
        var user = await userManager.FindByNameAsync(userName);
        if (user == null) return NotFound();

        var currentRoles = await userManager.GetRolesAsync(user);
        await userManager.RemoveFromRolesAsync(user, currentRoles);
        await userManager.AddToRoleAsync(user, role);

        return Ok();
    }
    
    [HttpPost("fix-prod-roles")]
    [Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult> FixProdRoles()
    {
        var staffUser = await userManager.FindByNameAsync("staff@lions.com");
        if (staffUser != null)
        {
            var staffRoles = await userManager.GetRolesAsync(staffUser);
            await userManager.RemoveFromRolesAsync(staffUser, staffRoles);
            await userManager.AddToRoleAsync(staffUser, RoleNames.Staff);
        }

        var adminUser = await userManager.FindByNameAsync("admin@lions.com");
        if (adminUser != null)
        {
            var adminRoles = await userManager.GetRolesAsync(adminUser);
            await userManager.RemoveFromRolesAsync(adminUser, adminRoles);
            await userManager.AddToRoleAsync(adminUser, RoleNames.Admin);
        }

        return Ok("Done");
    }

}


