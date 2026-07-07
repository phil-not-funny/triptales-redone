using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Triptales.Application.Cmd;
using Triptales.Webapi.Services;
using Triptales.Application.Model;

namespace Triptales.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public partial class CommentController : ControllerBase
    {
        private readonly CommentService _commentService;
        private readonly ModelConversions _modelConversions;
        private readonly ICurrentUserContext _currentUserContext;

        public CommentController(
            CommentService commentService,
            ModelConversions modelConversions,
            ICurrentUserContext currentUserContext)
        {
            _commentService = commentService;
            _modelConversions = modelConversions;
            _currentUserContext = currentUserContext;
        }

        [HttpPost()]
        [Authorize]
        public async Task<IActionResult> CommentPost([FromBody] AddCommentCmd cmd)
        {
            var author = await _currentUserContext.GetCurrentUserAsync();
            if (author is null)
                return Unauthorized();

            var (success, comment, errorMessage) = await _commentService.CreateCommentAsync(author, cmd);
            return success && comment is not null
                ? Ok(_modelConversions.ToPostCommentDto(comment))
                : BadRequest(errorMessage);
        }

        [HttpPost("like/{guid:Guid}")]
        [Authorize]
        public async Task<IActionResult> LikeComment(Guid guid)
        {
            var currentUser = await _currentUserContext.GetCurrentUserAsync();
            if (currentUser is null)
                return Unauthorized();

            var success = await _commentService.ToggleLikeAsync(guid, currentUser);
            return success ? Ok() : NotFound("Comment does not exist");
        }

        [HttpDelete("{guid:Guid}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(Guid guid)
        {
            var currentUser = await _currentUserContext.GetCurrentUserAsync();
            if (currentUser is null)
                return Unauthorized();

            var (success, errorMessage) = await _commentService.DeleteCommentAsync(guid, currentUser);
            return success ? NoContent() : (ActionResult)BadRequest(errorMessage);
        }

        [HttpGet("{guid:Guid}")]
        public async Task<IActionResult> GetComment(Guid guid)
        {
            var comment = await _commentService.GetCommentByGuidAsync(guid);
            if (comment is null)
                return NotFound("Comment does not exist");

            return Ok(_modelConversions.ToPostCommentDto(comment));
        }
    }
}
