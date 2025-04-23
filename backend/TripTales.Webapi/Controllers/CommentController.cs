using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Mvc;
using Triptales.Application.Cmd;
using Triptales.Repository;
using Triptales.Webapi.Infrastructure;
using Triptales.Webapi.Services;
using Triptales.Application.Model;
using System.Linq;

namespace Triptales.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public partial class CommentController : ControllerBase
    {
        private readonly TripTalesContext _db;
        private readonly PostRepository _postRepository;
        private readonly UserService _userService;
        private readonly ModelConversions _modelConversions;
        private readonly CommentRepository _repository;

        public CommentController(TripTalesContext db, UserService userService, CommentRepository repository, PostRepository postService, ModelConversions modelConversions)
        {
            _db = db;
            _userService = userService;
            _repository = repository;
            _postRepository = postService;
            _modelConversions = modelConversions;
        }

        private async Task<User?> GetAuthenticatedOrDefault()
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) return null;
            var username = HttpContext.User.Identity?.Name;
            if (username is null) return null;

            return await _userService.GetUserByUsername(username);
        }

        [HttpPost()]
        [Authorize]
        public async Task<IActionResult> CommentPost([FromBody] AddCommentCmd cmd)
        {

            if (cmd.Post is null && cmd.Parent is null)
                return BadRequest("Post or Parent must be specified");

            var authorized = await GetAuthenticatedOrDefault();
            if (authorized is null)
                return Unauthorized();

            var post = cmd.Post.HasValue ? await _postRepository.GetFromGuid(cmd.Post.Value) : null;
            var parent = cmd.Parent.HasValue ? await _repository.GetFromGuid(cmd.Parent.Value) : null;
            var comment = new Comment(authorized, cmd.Content, parent, post);
            await _repository.Insert(comment);
            return Ok(_modelConversions.ToPostCommentDto(comment));
        }

        [HttpPost("like/{guid:Guid}")]
        [Authorize]
        public async Task<IActionResult> LikeComment(Guid guid)
        {
            var authorized = await GetAuthenticatedOrDefault();
            if (authorized is null)
                return Unauthorized();

            var comment = await _repository.GetFromGuid(guid);
            if (comment is null)
                return NotFound("Comment does not exist");

            if (comment.Likes.Any(u => u.Guid == authorized.Guid))
                comment.Likes.Remove(authorized);
            else
                comment.Likes.Add(authorized);

            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{guid:Guid}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(Guid guid)
        {
            var authorized = await GetAuthenticatedOrDefault();
            if (authorized is null)
                return Unauthorized();

            var comment = await _repository.GetFromGuid(guid);
            if (comment is null)
                return NotFound("Comment does not exist");

            if (comment.Author.Guid != authorized.Guid)
                return Unauthorized("You are not the author of this comment");

            await _repository.Delete(guid);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("{guid:Guid}")]
        public async Task<IActionResult> GetComment(Guid guid)
        {
            var comment = await _repository.GetFromGuid(guid);
            if (comment is null)
                return NotFound("Comment does not exist");
            return Ok(_modelConversions.ToPostCommentDto(comment));
        }
    }
}
