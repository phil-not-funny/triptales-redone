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

        public UserDetailedDto ToUserDetailedDto(User user, bool userFollowing = false) =>
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
                user.Posts.Count > 0 ? user.Posts.Select(p => ToPostSmallDto(p)).ToList() : [],
                userFollowing);

        public UserPublicSmallDto ToUserPublicSmallDto(User user) =>
            new(user.Guid, user.Username, user.DisplayName, user.Verified);

        public UserPublicDto ToUserPublicDto(User user) => new(
            user.Guid, user.Username, user.DisplayName, user.Verified,
            user.Following.Count > 0 ? user.Following.Select(ToUserPublicSmallDto).ToList() : []);

        public UserPrivateDto ToUserPrivateDto(User user) =>
            new(user.Guid, user.Username, user.DisplayName, user.Email);

        public PostSmallDto ToPostSmallDto(Post a, bool userLiked = false) => new(
                a.Guid,
                a.Title,
                a.Description,
                ToUserPublicSmallDto(a.Author),
                a.StartDate.ToString(),
                a.EndDate.ToString(),
                a.CreatedAt.ToString(),
                a.Likes.Count,
                userLiked,
                a.Comments.Count);

        public PostDto ToPostDto(Post a, bool userLiked = false, bool userCommented = false) => new(
                a.Guid,
                a.Title,
                a.Description,
                ToUserPublicSmallDto(a.Author),
                a.StartDate.ToString(),
                a.EndDate.ToString(),
                a.CreatedAt.ToString(),
                a.Likes.Count,
                a.Days.Select(ToPostDayDto).ToList(),
                userLiked,
                a.Comments.Count,
                a.Comments.Count > 0 ? a.Comments.Select(c => ToPostCommentDto(c)).ToList() : [],
                userCommented);

        public PostCommentDto ToPostCommentDto(Post.Comment c, bool userLiked = false) => new(
                c.Guid,
                ToUserPublicSmallDto(c.Author),
                c.Content,
                c.CreatedAt.ToString(),
                c.Comments.Count > 0 ? c.Comments.Select(o => ToPostCommentDto(o)).ToList() : [],
                c.Comments.Count,
                c.Likes.Count,
                userLiked);

        public PostDayDto ToPostDayDto(Post.Day d) => new(d.Title, d.Description, d.Date.ToString());
    }
}
