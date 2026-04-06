namespace Selu383.SP26.Api.Features.Auth;

public class UserPoints
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int Points { get; set; } = 0;
    public virtual User User { get; set; } = null!;
}