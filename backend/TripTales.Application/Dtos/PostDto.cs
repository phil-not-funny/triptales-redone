using System;

namespace Triptales.Webapi.Dtos
{
    public record PostDto(Guid Guid,
                          string Title,
                          string Description,
                          UserPublicSmallDto Author,
                          string StartDate,
                          string EndDate,
                          string CreatedAt,
                          int LikesCount);

}
