using System.Linq;
using Triptales.Application.Dtos;
using Triptales.Application.Model;

namespace Triptales.Webapi.Services
{
    public class ModelConversions
    {
        private readonly UserService _userService;
        private readonly PostService _postService;

        public ModelConversions( PostService postService, UserService userService)
        {
            _postService = postService;
            _userService = userService;
        }

        public UserDetailedDto ConvertToDetailed(User user) =>
            new(
                user.Guid,
                user.Username, user.Email, user.DisplayName, user.Verified,
                user.Biography, user.PlaceOfResidence, user.FavoriteDestination,
                user.MemberSince.ToString(),
                _userService.GetFollowers(user.Guid).Count,
                user.Posts.Count > 0 ? user.Posts.Select(p => ConvertToPostDto(p)).ToList() : new()
            );

        public UserPublicSmallDto ConvertToPublicSmall(User user) =>
            new(user.Guid, user.Username, user.DisplayName, user.Verified);

        public UserPublicDto ConvertToPublic(User user) => new UserPublicDto(
            user.Guid, user.Username, user.DisplayName, user.Verified,
            user.Following.Count > 0 ? user.Following.Select(u => ConvertToPublicSmall(u)).ToList() : new());

        public UserPrivateDto ConvertToPrivate(User user) =>
            new(user.Guid, user.Username, user.DisplayName, user.Email);

        public PostDto ConvertToPostDto(Post a) => new PostDto(
                a.Guid,
                a.Title,
                a.Description,
                ConvertToPublicSmall(a.Author),
                a.StartDate.ToString(),
                a.EndDate.ToString(),
                a.CreatedAt.ToString(),
                a.Likes.Count);
    }
}
