namespace Triptales.Application.Cmd
{
    public record UserFlavorCmd(string Username, string DisplayName, string? Biography, string? PlaceOfResidence, string? FavoriteDestination);
}
