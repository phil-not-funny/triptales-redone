using System;
using System.Collections.Generic;
using Triptales.Application.Model;

namespace Triptales.Application.Dtos
{
    public record PostDto(Guid Guid,
                          string Title,
                          string Description,
                          UserPublicSmallDto Author,
                          string StartDate,
                          string EndDate,
                          string CreatedAt,
                          int LikesCount,
                          List<PostDayDto> Days,
                          bool UserLiked,
                          int CommentsCount,
                          List<PostCommentDto> Comments,
                          bool UserCommented);
}
