using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Selu383.SP26.Api.Features.Auth;
using Selu383.SP26.Api.Features.Locations;

namespace Selu383.SP26.Api.Data;

public static class SeedHelper
{
    public static async Task MigrateAndSeed(IServiceProvider serviceProvider)
    {
        var dataContext = serviceProvider.GetRequiredService<DataContext>();

        await dataContext.Database.MigrateAsync();

        await AddRoles(serviceProvider);
        await AddUsers(serviceProvider);
        await AddLocations(dataContext);
    }

    private static async Task AddUsers(IServiceProvider serviceProvider)
    {
        const string defaultPassword = "Password123!";
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

        if (userManager.Users.Any())
        {
            return;
        }

        var guest = new User { UserName = "guest@lions.com", Email = "guest@lions.com" };
        var guestResult = await userManager.CreateAsync(guest, defaultPassword);
        if (!guestResult.Succeeded) throw new Exception(string.Join(", ", guestResult.Errors.Select(e => e.Description)));
        await userManager.AddToRoleAsync(guest, RoleNames.User);

        var staff = new User { UserName = "staff@lions.com", Email = "staff@lions.com" };
        var staffResult = await userManager.CreateAsync(staff, defaultPassword);
        if (!staffResult.Succeeded) throw new Exception(string.Join(", ", staffResult.Errors.Select(e => e.Description)));
        await userManager.AddToRoleAsync(staff, RoleNames.Staff);

        var admin = new User { UserName = "admin@lions.com", Email = "admin@lions.com" };
        var adminResult = await userManager.CreateAsync(admin, defaultPassword);
        if (!adminResult.Succeeded) throw new Exception(string.Join(", ", adminResult.Errors.Select(e => e.Description)));
        await userManager.AddToRoleAsync(admin, RoleNames.Admin);

        var manager = new User { UserName = "manager@lions.com", Email = "manager@lions.com" };
        var managerResult = await userManager.CreateAsync(manager, defaultPassword);
        if (!managerResult.Succeeded) throw new Exception(string.Join(", ", managerResult.Errors.Select(e => e.Description)));
        await userManager.AddToRoleAsync(manager, RoleNames.Manager);
    }

    private static async Task AddRoles(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();

        if (!roleManager.Roles.Any(r => r.Name == RoleNames.Admin))
            await roleManager.CreateAsync(new Role { Name = RoleNames.Admin });

        if (!roleManager.Roles.Any(r => r.Name == RoleNames.User))
            await roleManager.CreateAsync(new Role { Name = RoleNames.User });

        if (!roleManager.Roles.Any(r => r.Name == RoleNames.Staff))
            await roleManager.CreateAsync(new Role { Name = RoleNames.Staff });
        
        if (!roleManager.Roles.Any(r => r.Name == RoleNames.Manager))
            await roleManager.CreateAsync(new Role { Name = RoleNames.Manager });
    }

    private static async Task AddLocations(DataContext dataContext)
    {
        if (dataContext.Set<Location>().Any())
        {
            return;
        }

        dataContext.Set<Location>().AddRange(
            new Location { Name = "Caffeinated Lions Downtown",  Address = "123 Main St, Hammond, LA 70401",    TableCount = 10 },
            new Location { Name = "Caffeinated Lions Northside", Address = "456 Oak Ave, Hammond, LA 70403",    TableCount = 12 },
            new Location { Name = "Caffeinated Lions Lakefront", Address = "789 Lake Shore Dr, Mandeville, LA 70448", TableCount = 15 }
        );

        await dataContext.SaveChangesAsync();
    }
}