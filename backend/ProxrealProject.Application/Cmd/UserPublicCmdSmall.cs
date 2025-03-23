using System;

namespace Triptales.Application.Cmd
{
    public record UserPublicCmdSmall(Guid Guid, string Username, string DisplayName, bool Verified);
}
