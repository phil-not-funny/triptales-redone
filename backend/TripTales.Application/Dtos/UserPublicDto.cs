using System;
using System.Collections.Generic;

namespace Triptales.Application.Dtos
{
    public record UserPublicDto(Guid Guid, string Username, string DisplayName, bool Verified, List<UserPublicSmallDto> following);
}
