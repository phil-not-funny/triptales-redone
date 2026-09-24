using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Triptales.Application.Cmd;
using Triptales.Application.Model;
using Triptales.Repository;
using Triptales.Webapi.Controllers;
using Triptales.Webapi.Services;

namespace Triptales.Controllers
{
    [Route("api/[controller]")]
    public class CommentController : ApiControllerBase
    {
        private readonly PostRepository _postRepository;
        private readonly ModelConversions _modelConversions;
        private readonly CommentRepository _repository;

        public CommentController(UserService userService, CommentRepository repository, PostRepository postRepository, ModelConversions modelConversions)
            : base(userService)
        {
            _repository = repository;
            _postRepository = postRepository;
            _modelConversions = modelConversions;
        }

        [HttpPost()]
        [Authorize]
        public async Task<IActionResult> CommentPost([FromBody] AddCommentCmd cmd)
        {

            if (cmd.Post is null && cmd.Parent is null)
                return BadRequest("Post or Parent must be specified");

            if (string.IsNullOrWhiteSpace(cmd.Content))
                return BadRequest("Comment must not be empty");

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

            await _repository.ToggleLike(comment, authorized);
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

            if (!authorized.CanModify(comment.Author))
                return Unauthorized("You are not the author of this comment");

            await _repository.Delete(guid);
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
