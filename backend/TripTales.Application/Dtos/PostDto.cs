using System;
using Triptales.Webapi.Cmd;

namespace Triptales.Webapi.Dtos
{
    public record PostDto(Guid Guid,
                          string Title,
                          string Description,
                          UserPublicCmdSmall Author,
                          string StartDate,
                          string EndDate,
                          string CreatedAt,
                          int LikesCount);

}
