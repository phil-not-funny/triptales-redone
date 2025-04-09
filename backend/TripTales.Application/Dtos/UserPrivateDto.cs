using System;

namespace Triptales.Application.Dtos
{
    public record UserPrivateDto(Guid Guid, string Username, string DisplayName, string Email);
}
