using System;

namespace Triptales.Application.Cmd
{
    public record UserPrivateCmd(Guid Guid, string Username, string DisplayName, string Email);
}
