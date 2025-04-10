using System;

namespace Triptales.Webapi.Cmd
{
    public record UserPublicCmdSmall(Guid Guid, string Username, string DisplayName, bool Verified);
}
