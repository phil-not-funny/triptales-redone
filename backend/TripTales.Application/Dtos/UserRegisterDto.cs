namespace Triptales.Application.Dtos
{
    public record UserRegisterDto(
        string Username,
        string Password,
        string Email,
        string DisplayName
    );
}
