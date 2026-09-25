using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Triptales.Application.Dtos;
using Triptales.Repository;
using Triptales.Webapi.Services;

namespace Triptales.Webapi.Controllers
{
    [Route("api/[controller]")]
    public class SearchController : ApiControllerBase
    {
        private const int MaxResultsPerKind = 30;

        private readonly UserRepository _users;
        private readonly PostRepository _posts;
        private readonly ModelConversions _modelConversions;

        public SearchController(UserService userService, UserRepository users, PostRepository posts, ModelConversions modelConversions)
            : base(userService)
        {
            _users = users;
            _posts = posts;
            _modelConversions = modelConversions;
        }

        /// <summary>
        /// Searches users (username, display name) and posts (title, description, author) at once.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<SearchResultDto>> Search([FromQuery] string? query)
        {
            var term = query?.Trim();
            if (string.IsNullOrEmpty(term))
                return Ok(new SearchResultDto([], []));

            var authenticated = await GetAuthenticatedOrDefault();
            var users = await _users.Search(term, MaxResultsPerKind);
            var posts = await _posts.Search(term, MaxResultsPerKind);

            return Ok(new SearchResultDto(
                users.Select(_modelConversions.ToUserPublicSmallDto).ToList(),
                posts.Select(p => _modelConversions.ToPostSmallDto(p, p.IsLikedBy(authenticated?.Guid))).ToList()));
        }
    }
}
