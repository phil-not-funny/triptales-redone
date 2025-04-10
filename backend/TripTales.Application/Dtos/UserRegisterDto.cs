namespace Triptales.Webapi.Dtos
{
    public record UserRegisterDto(
        string Username,
        string Password,
        string Email,
        string DisplayName
    );
}
