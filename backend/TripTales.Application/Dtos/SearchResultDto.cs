using System.Collections.Generic;

namespace Triptales.Application.Dtos
{
    public record SearchResultDto(List<UserPublicSmallDto> Users, List<PostSmallDto> Posts);
}
