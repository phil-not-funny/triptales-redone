using System;

namespace Triptales.Webapi.Cmd
{
    public record UserPrivateCmd(Guid Guid, string Username, string DisplayName, string Email);
}
