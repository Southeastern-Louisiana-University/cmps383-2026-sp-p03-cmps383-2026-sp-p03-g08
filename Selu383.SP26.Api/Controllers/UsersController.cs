using System.Transactions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP26.Api.Features.Auth;

namespace Selu383.SP26.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly UserManager<User> userManager;

    public UsersController(UserManager<User> userManager)
    {
        this.userManager = userManager;
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
        return Ok(user.Points);
    }

    [HttpPost("points/add")]
    [Authorize]
    public async Task<ActionResult<int>> AddPoints([FromBody] int points)
    {
        var userName = User.Identity!.Name;
        var user = await userManager.FindByNameAsync(userName!);
        if (user == null) return NotFound();
        user.Points += points;
        await userManager.UpdateAsync(user);
        return Ok(user.Points);
    }
    }

