namespace Triptales.Application.Dtos
{
    public record UserLoginDto(string Username, string Password);

    public record UserLoginEmailDto(string email, string password);
}
