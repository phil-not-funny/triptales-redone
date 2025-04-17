using System;
using System.Collections.Generic;

namespace Triptales.Application.Dtos
{
    public record PostCommentDto(Guid Guid,
                                 UserPublicSmallDto Author,
                                 string Content,
                                 string CreatedAt,
                                 List<PostCommentDto> Comments,
                                 int CommentsCount,
                                 int LikesCount,
                                 bool UserLiked);
}
