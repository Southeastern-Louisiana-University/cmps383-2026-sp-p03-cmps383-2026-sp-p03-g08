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
    private readonly RoleManager<Role> roleManager;

    public UsersController(UserManager<User> userManager, DataContext dbContext, RoleManager<Role> roleManager)
    {
        this.userManager = userManager;
        this.dbContext = dbContext;
        this.roleManager = roleManager;
    }

    [HttpGet]
    [Authorize(Roles = RoleNames.Admin + "," + RoleNames.Manager)]
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
                LocationId = user.LocationId,
                Name = user.Name,
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
        // Ensure all roles exist
        foreach (var roleName in new[] { RoleNames.Admin, RoleNames.User, RoleNames.Staff, RoleNames.Manager })
        {
            if (!await roleManager.RoleExistsAsync(roleName))
                await roleManager.CreateAsync(new Role { Name = roleName });
        }

        // Fix existing accounts
        var adminUser = await userManager.FindByNameAsync("admin@lions.com");
        if (adminUser != null)
        {
            var roles = await userManager.GetRolesAsync(adminUser);
            await userManager.RemoveFromRolesAsync(adminUser, roles);
            await userManager.AddToRoleAsync(adminUser, RoleNames.Admin);
        }

        var guestUser = await userManager.FindByNameAsync("guest@lions.com");
        if (guestUser != null)
        {
            var roles = await userManager.GetRolesAsync(guestUser);
            await userManager.RemoveFromRolesAsync(guestUser, roles);
            await userManager.AddToRoleAsync(guestUser, RoleNames.User);
        }

        // Create location-specific staff and manager accounts
        var locationAccounts = new[]
        {
            new { UserName = "staff.hammond@lions.com",     Email = "staff.hammond@lions.com",     Role = RoleNames.Staff,   LocationId = 1, Name = "Sara L."  },
            new { UserName = "staff.newyork@lions.com",     Email = "staff.newyork@lions.com",     Role = RoleNames.Staff,   LocationId = 2, Name = "Carol T." },
            new { UserName = "staff.neworleans@lions.com",  Email = "staff.neworleans@lions.com",  Role = RoleNames.Staff,   LocationId = 3, Name = "Frank B." },
            new { UserName = "manager.hammond@lions.com",   Email = "manager.hammond@lions.com",   Role = RoleNames.Manager, LocationId = 1, Name = "Mike A."  },
            new { UserName = "manager.newyork@lions.com",   Email = "manager.newyork@lions.com",   Role = RoleNames.Manager, LocationId = 2, Name = "David M." },
            new { UserName = "manager.neworleans@lions.com",Email = "manager.neworleans@lions.com",Role = RoleNames.Manager, LocationId = 3, Name = "Eve S."   },
        };

        foreach (var account in locationAccounts)
        {
            var user = await userManager.FindByNameAsync(account.UserName);
            if (user == null)
            {
                user = new User { UserName = account.UserName, Email = account.Email, LocationId = account.LocationId, Name = account.Name };
                var result = await userManager.CreateAsync(user, "Password123!");
                if (!result.Succeeded) continue;
            }
            else
            {
                user.LocationId = account.LocationId;
                user.Name = account.Name;
                await userManager.UpdateAsync(user);
            }
            var roles = await userManager.GetRolesAsync(user);
            await userManager.RemoveFromRolesAsync(user, roles);
            await userManager.AddToRoleAsync(user, account.Role);
        }

        return Ok("Done");
    }
}
