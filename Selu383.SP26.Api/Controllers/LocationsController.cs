using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Extensions;
using Selu383.SP26.Api.Features.Auth;
using Selu383.SP26.Api.Features.Locations;
using System.Text.Json;

namespace Selu383.SP26.Api.Controllers;

[Route("api/locations")]
[ApiController]
public class LocationsController(DataContext dataContext) : ControllerBase
{
    private static Dictionary<string, bool> ParseSettings(string json)
    {
        try { return JsonSerializer.Deserialize<Dictionary<string, bool>>(json) ?? new(); }
        catch { return new(); }
    }

    private static string SerializeSettings(Dictionary<string, bool> settings)
    {
        try { return JsonSerializer.Serialize(settings); }
        catch { return "{}"; }
    }

    [HttpGet]
    public IQueryable<LocationDto> GetAll()
    {
        return dataContext.Set<Location>()
            .Select(x => new LocationDto
            {
                Id = x.Id,
                Name = x.Name,
                Address = x.Address,
                TableCount = x.TableCount,
                ManagerId = x.ManagerId,
                Settings = new Dictionary<string, bool>(),
            });
    }

    [HttpGet("{id}")]
    public ActionResult<LocationDto> GetById(int id)
    {
        var result = dataContext.Set<Location>()
            .FirstOrDefault(x => x.Id == id);

        if (result == null) return NotFound();

        return Ok(new LocationDto
        {
            Id = result.Id,
            Name = result.Name,
            Address = result.Address,
            TableCount = result.TableCount,
            ManagerId = result.ManagerId,
            Settings = ParseSettings(result.SettingsJson),
        });
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult<LocationDto> Create(LocationDto dto)
    {
        if (dto.TableCount < 1) return BadRequest();

        var location = new Location
        {
            Name = dto.Name,
            Address = dto.Address,
            TableCount = dto.TableCount,
            ManagerId = dto.ManagerId,
            SettingsJson = SerializeSettings(dto.Settings),
        };

        dataContext.Set<Location>().Add(location);
        dataContext.SaveChanges();

        dto.Id = location.Id;
        return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
    }

    [HttpPut("{id}")]
    [Authorize]
    public ActionResult<LocationDto> Update(int id, LocationDto dto)
    {
        if (dto.TableCount < 1) return BadRequest();

        var location = dataContext.Set<Location>()
            .FirstOrDefault(x => x.Id == id);

        if (location == null) return NotFound();

        if (!User.IsInRole(RoleNames.Admin) && User.GetCurrentUserId() != location.ManagerId)
            return Forbid();

        location.Name = dto.Name;
        location.Address = dto.Address;
        location.TableCount = dto.TableCount;
        location.ManagerId = dto.ManagerId;
        location.SettingsJson = SerializeSettings(dto.Settings);

        dataContext.SaveChanges();

        dto.Id = location.Id;
        return Ok(dto);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public ActionResult Delete(int id)
    {
        var location = dataContext.Set<Location>()
            .FirstOrDefault(x => x.Id == id);

        if (location == null) return NotFound();

        if (!User.IsInRole(RoleNames.Admin) && User.GetCurrentUserId() != location.ManagerId)
            return Forbid();

        dataContext.Set<Location>().Remove(location);
        dataContext.SaveChanges();

        return Ok();
    }

    [HttpPost("fix-names")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> FixNames()
    {
        var locs = await dataContext.Set<Location>().ToListAsync();
        var nameMap = new Dictionary<int, string> { {1,"Hammond"}, {2,"New York"}, {3,"New Orleans"} };
        foreach (var loc in locs)
            if (nameMap.ContainsKey(loc.Id)) loc.Name = nameMap[loc.Id];
        await dataContext.SaveChangesAsync();
        return Ok("Done");
    }
}