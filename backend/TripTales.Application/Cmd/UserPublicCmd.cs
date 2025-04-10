using System;
using System.Collections.Generic;

namespace Triptales.Webapi.Cmd
{
    public record UserPublicCmd(Guid Guid, string Username, string DisplayName, bool Verified, List<UserPublicCmdSmall> following);
}
