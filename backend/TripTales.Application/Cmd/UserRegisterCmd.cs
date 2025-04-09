namespace Triptales.Application.Dtos
{
    public record UserRegisterCmd(
        string Username,
        string Password,
        string Email,
        string DisplayName
    );
}
