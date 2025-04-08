using System;
using Triptales.Application.Cmd;

namespace Triptales.Application.Dtos
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
