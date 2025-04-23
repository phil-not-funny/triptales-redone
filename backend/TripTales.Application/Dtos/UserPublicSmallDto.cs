using System;

namespace Triptales.Application.Dtos
{
    public record UserPublicSmallDto(Guid Guid, string Username, string DisplayName, bool Verified, string? ProfilePicture);
}
