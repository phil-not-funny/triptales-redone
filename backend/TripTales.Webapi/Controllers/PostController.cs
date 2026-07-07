using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Triptales.Application.Model;
using Triptales.Application.Dtos;
using Triptales.Application.Cmd;
using Triptales.Webapi.Services;
using Microsoft.AspNetCore.Authorization;

namespace Triptales.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public partial class PostController : ControllerBase
    {
        private readonly PostService _postService;
        private readonly ModelConversions _modelConversions;
        private readonly ICurrentUserContext _currentUserContext;

        public PostController(
            PostService postService,
            ModelConversions modelConversions,
            ICurrentUserContext currentUserContext)
        {
            _postService = postService;
            _modelConversions = modelConversions;
            _currentUserContext = currentUserContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<PostSmallDto>>> GetPosts()
        {
            var posts = await _postService.GetAllPostsAsync();
            var currentUser = await _currentUserContext.GetCurrentUserAsync();

            var dtos = posts.Select(p => _modelConversions.ToPostSmallDto(
                p,
                currentUser is not null && p.Likes.Any(u => u.Guid == currentUser.Guid)
            )).ToList();

            return Ok(dtos);
        }

        [HttpGet("{guid:Guid}")]
        public async Task<ActionResult<PostDto>> GetPost(Guid guid)
        {
            var post = await _postService.GetPostByGuidAsync(guid);
            if (post is null)
                return NotFound("Post not found");

            var currentUser = await _currentUserContext.GetCurrentUserAsync();
            var isLiked = currentUser is not null && post.Likes.Any(u => u.Guid == currentUser.Guid);

            return Ok(_modelConversions.ToPostDto(post, isLiked));
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> AddPost([FromBody] AddPostCmd cmd)
        {
            var user = await _currentUserContext.GetCurrentUserAsync();
            if (user is null)
                return Unauthorized();

            var (success, postGuid, errorMessage) = await _postService.CreatePostAsync(user, cmd);
            return success ? Ok(postGuid) : BadRequest(errorMessage);
        }

        [HttpDelete("{guid:Guid}")]
        [Authorize]
        public async Task<ActionResult> DeletePost(Guid guid)
        {
            var currentUser = await _currentUserContext.GetCurrentUserAsync();
            if (currentUser is null)
                return Unauthorized();

            var (success, errorMessage) = await _postService.DeletePostAsync(guid, currentUser);
            return success ? NoContent() : (ActionResult)BadRequest(errorMessage);
        }

        [HttpPut("{guid:Guid}")]
        [Authorize]
        public async Task<ActionResult> UpdatePost(Guid guid, [FromBody] UpdatePostCmd cmd)
        {
            var currentUser = await _currentUserContext.GetCurrentUserAsync();
            if (currentUser is null)
                return Unauthorized();

            var (success, errorMessage) = await _postService.UpdatePostAsync(guid, cmd, currentUser);
            return success ? NoContent() : BadRequest(errorMessage);
        }

        [HttpGet("random")]
        public async Task<ActionResult<List<PostSmallDto>>> GetRandom([FromQuery] int size = 10)
        {
            if (size <= 0)
                return BadRequest("Size must be greater than 0");

            var posts = await _postService.GetRandomPostsAsync(size);
            var currentUser = await _currentUserContext.GetCurrentUserAsync();

            var dtos = posts.Select(p => _modelConversions.ToPostSmallDto(
                p,
                currentUser is not null && p.Likes.Any(u => u.Guid == currentUser.Guid)
            )).ToList();

            return Ok(dtos);
        }

        [HttpPost("like/{guid:Guid}")]
        [Authorize]
        public async Task<IActionResult> LikePost(Guid guid)
        {
            var currentUser = await _currentUserContext.GetCurrentUserAsync();
            if (currentUser is null)
                return Unauthorized();

            var success = await _postService.ToggleLikeAsync(guid, currentUser);
            return success ? Ok() : NotFound("Post not found");
        }
    }
}
