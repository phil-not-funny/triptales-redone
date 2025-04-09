using System;
using System.Collections.Generic;

namespace Triptales.Application.Dtos
{
    public record UserDetailedDto(Guid Guid,
        string Username,
        string DisplayName,
        bool Verified,
        string? Biography,
        string? PlaceOfResidence,
        string? FavoriteDestination,
        string MemberSince,
        int FollowerCount,
        List<PostDto> Posts,
        bool? Follows = false);
}
