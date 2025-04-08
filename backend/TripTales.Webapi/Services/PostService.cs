using Triptales.Application.Dtos;
using Triptales.Application.Model;
using Triptales.Webapi.Infrastructure;

namespace Triptales.Application.Services
{
    public class PostService
    {
        private readonly TripTalesContext _db;
        private readonly UserService _userService;

        public PostService(TripTalesContext db, UserService userService)
        {
            _db = db;
            _userService = userService;
        }

        public PostDto ConvertToPostDto(Post a) => new PostDto(
                a.Guid,
                a.Title,
                a.Description,
                _userService.ConvertToPublicSmall(a.Author),
                a.StartDate.ToString(),
                a.EndDate.ToString(),
                a.CreatedAt.ToString(),
                a.Likes.Count);
    }
}
