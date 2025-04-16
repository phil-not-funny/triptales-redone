using System.Linq;
using Triptales.Application.Dtos;
using Triptales.Application.Model;

namespace Triptales.Webapi.Services
{
    public class ModelConversions
    {
        private readonly UserService _userService;
        private readonly PostService _postService;

        public ModelConversions(PostService postService, UserService userService)
        {
            _postService = postService;
            _userService = userService;
        }

        public UserDetailedDto ConvertToDetailed(User user, bool userFollowing = false) =>
            new(
                user.Guid,
                user.Username,
                user.DisplayName,
                user.Verified,
                user.Biography,
                user.PlaceOfResidence,
                user.FavoriteDestination,
                user.MemberSince.ToString(),
                _userService.GetFollowers(user.Guid).Count,
                user.ProfilePicture,
                user.BannerImage,
                user.Posts.Count > 0 ? user.Posts.Select(p => ConvertToPostSmallDto(p)).ToList() : new(),
                userFollowing);

        public UserPublicSmallDto ConvertToPublicSmall(User user) =>
            new(user.Guid, user.Username, user.DisplayName, user.Verified);

        public UserPublicDto ConvertToPublic(User user) => new(
            user.Guid, user.Username, user.DisplayName, user.Verified,
            user.Following.Count > 0 ? user.Following.Select(u => ConvertToPublicSmall(u)).ToList() : new());

        public UserPrivateDto ConvertToPrivate(User user) =>
            new(user.Guid, user.Username, user.DisplayName, user.Email);

        public PostSmallDto ConvertToPostSmallDto(Post a, bool userLiked = false) => new(
                a.Guid,
                a.Title,
                a.Description,
                ConvertToPublicSmall(a.Author),
                a.StartDate.ToString(),
                a.EndDate.ToString(),
                a.CreatedAt.ToString(),
                a.Likes.Count,
                userLiked);

        public PostDto ConvertToPostDto(Post a, bool userLiked = false) => new(
                a.Guid,
                a.Title,
                a.Description,
                ConvertToPublicSmall(a.Author),
                a.StartDate.ToString(),
                a.EndDate.ToString(),
                a.CreatedAt.ToString(),
                a.Likes.Count,
                a.Days.Select(d => new PostDayDto(d.Title, d.Description, d.Date.ToString())).ToList(),
                userLiked);
    }
}
