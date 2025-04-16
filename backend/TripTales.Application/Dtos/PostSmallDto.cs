using System;

namespace Triptales.Application.Dtos
{
    public record PostSmallDto(Guid Guid,
                          string Title,
                          string Description,
                          UserPublicSmallDto Author,
                          string StartDate,
                          string EndDate,
                          string CreatedAt,
                          int LikesCount,
                          bool UserLiked);
}
