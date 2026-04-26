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

        /*var staff = new User { UserName = "staff@lions.com", Email = "staff@lions.com" };
        var staffResult = await userManager.CreateAsync(staff, defaultPassword);
        if (!staffResult.Succeeded) throw new Exception(string.Join(", ", staffResult.Errors.Select(e => e.Description)));
        await userManager.AddToRoleAsync(staff, RoleNames.Staff);
        staff.LocationId = 1; // Hammond
        await userManager.UpdateAsync(staff);*/

        var admin = new User { UserName = "admin@lions.com", Email = "admin@lions.com" };
        var adminResult = await userManager.CreateAsync(admin, defaultPassword);
        if (!adminResult.Succeeded) throw new Exception(string.Join(", ", adminResult.Errors.Select(e => e.Description)));
        await userManager.AddToRoleAsync(admin, RoleNames.Admin);

        /*var manager = new User { UserName = "manager@lions.com", Email = "manager@lions.com" };
        var managerResult = await userManager.CreateAsync(manager, defaultPassword);
        if (!managerResult.Succeeded) throw new Exception(string.Join(", ", managerResult.Errors.Select(e => e.Description)));
        await userManager.AddToRoleAsync(manager, RoleNames.Manager);
        await userManager.AddToRoleAsync(manager, RoleNames.Manager);
        manager.LocationId = 1; // Hammond
        await userManager.UpdateAsync(manager);*/

        // Staff accounts per location
        var staff1 = new User { UserName = "staff.hammond@lions.com", Email = "staff.hammond@lions.com", LocationId = 1, Name = "Sara L."};
        var staff1Result = await userManager.CreateAsync(staff1, defaultPassword);
        if (!staff1Result.Succeeded) throw new Exception(string.Join(", ", staff1Result.Errors.Select(e => e.Description)));
        await userManager.AddToRoleAsync(staff1, RoleNames.Staff);

        var staff2 = new User { UserName = "staff.newyork@lions.com", Email = "staff.newyork@lions.com", LocationId = 2, Name = "Danny B." };
        var staff2Result = await userManager.CreateAsync(staff2, defaultPassword);
        if (!staff2Result.Succeeded) throw new Exception(string.Join(", ", staff2Result.Errors.Select(e => e.Description)));
        await userManager.AddToRoleAsync(staff2, RoleNames.Staff);

        var staff3 = new User { UserName = "staff.neworleans@lions.com", Email = "staff.neworleans@lions.com", LocationId = 3, Name = "Preston G." };
        var staff3Result = await userManager.CreateAsync(staff3, defaultPassword);
        if (!staff3Result.Succeeded) throw new Exception(string.Join(", ", staff3Result.Errors.Select(e => e.Description)));
        await userManager.AddToRoleAsync(staff3, RoleNames.Staff);

        // Manager accounts per location
        var manager1 = new User { UserName = "manager.hammond@lions.com", Email = "manager.hammond@lions.com", LocationId = 1, Name = "Doris B." };
        var manager1Result = await userManager.CreateAsync(manager1, defaultPassword);
        if (!manager1Result.Succeeded) throw new Exception(string.Join(", ", manager1Result.Errors.Select(e => e.Description)));
        await userManager.AddToRoleAsync(manager1, RoleNames.Manager);

        var manager2 = new User { UserName = "manager.newyork@lions.com", Email = "manager.newyork@lions.com", LocationId = 2, Name = "Nicole J." };
        var manager2Result = await userManager.CreateAsync(manager2, defaultPassword);
        if (!manager2Result.Succeeded) throw new Exception(string.Join(", ", manager2Result.Errors.Select(e => e.Description)));
        await userManager.AddToRoleAsync(manager2, RoleNames.Manager);

        var manager3 = new User { UserName = "manager.neworleans@lions.com", Email = "manager.neworleans@lions.com", LocationId = 3, Name = "Gerald D." };
        var manager3Result = await userManager.CreateAsync(manager3, defaultPassword);
        if (!manager3Result.Succeeded) throw new Exception(string.Join(", ", manager3Result.Errors.Select(e => e.Description)));
        await userManager.AddToRoleAsync(manager3, RoleNames.Manager);
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
            new Location { Name = "Hammond",  Address = "123 Main St, Hammond, LA 70401",    TableCount = 10 },
            new Location { Name = "New York", Address = "456 Oak Ave, Hammond, LA 70403",    TableCount = 12 },
            new Location { Name = "New Orleans", Address = "789 Lake Shore Dr, Mandeville, LA 70448", TableCount = 15 }
        );

        await dataContext.SaveChangesAsync();
    }
}