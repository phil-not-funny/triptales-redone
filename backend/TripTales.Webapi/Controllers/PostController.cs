using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Triptales.Application.Cmd;
using Triptales.Application.Dtos;
using Triptales.Application.Model;
using Triptales.Repository;
using Triptales.Webapi.Controllers;
using Triptales.Webapi.Services;

namespace Triptales.Controllers
{
    [Route("api/[controller]")]
    public class PostController : ApiControllerBase
    {
        private readonly ModelConversions _modelConversions;
        private readonly PostRepository _repository;

        public PostController(UserService userService, PostRepository repository, ModelConversions modelConversions)
            : base(userService)
        {
            _repository = repository;
            _modelConversions = modelConversions;
        }

        /// <summary>
        /// Loads a post the authenticated user is allowed to edit.
        /// </summary>
        /// <returns>The post, or the error response to return when authentication, lookup or authorization fails.</returns>
        private async Task<(Post? Post, IActionResult? Error)> GetEditablePost(Guid guid)
        {
            var authenticated = await GetAuthenticatedOrDefault();
            if (authenticated is null) return (null, Unauthorized("User not authenticated"));

            var post = await _repository.GetWithAuthor(guid);
            if (post is null) return (null, NotFound("Post not found"));

            if (!authenticated.CanModify(post.Author))
                return (null, Unauthorized("You are not authorized to edit this post"));

            return (post, null);
        }

        [HttpGet]
        public async Task<ActionResult<List<PostSmallDto>>> GetPosts()
        {
            var authenticated = await GetAuthenticatedOrDefault();
            return Ok((await _repository.GetAll())
                .Select(p => _modelConversions.ToPostSmallDto(p, p.IsLikedBy(authenticated?.Guid)))
                .ToList());
        }

        [HttpGet("{guid:Guid}")]
        public async Task<ActionResult<PostDto>> GetPost(Guid guid)
        {
            var authenticated = await GetAuthenticatedOrDefault();
            var post = await _repository.GetFromGuid(guid);
            if (post is null)
            {
                return BadRequest("Post not found");
            }
            return Ok(_modelConversions.ToPostDto(post, post.IsLikedBy(authenticated?.Guid)));
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> AddPost([FromBody] AddPostCmd cmd)
        {
            var user = await GetAuthenticatedOrDefault();
            if (user is null) return Unauthorized("User not authenticated");
            var post = new Post(cmd.Title, cmd.Description, user, DateOnly.Parse(cmd.StartDate), DateOnly.Parse(cmd.EndDate), cmd.Days.Select(d => new Post.Day(d.Title, d.Description, DateOnly.Parse(d.Date))).ToList());
            return await _repository.Insert(post) ? Ok(post.Guid) : BadRequest("Insert failed! Check if the parameters are correct");
        }

        [HttpDelete("{guid:Guid}")]
        [Authorize]
        public async Task<ActionResult> DeletePost(Guid guid)
        {
            var authenticated = await GetAuthenticatedOrDefault();
            if (authenticated is null)
                return Unauthorized("User not authenticated");

            var requested = await _repository.GetFromGuid(guid);
            if (requested is null)
                return NotFound("Post not found");

            if (!authenticated.CanModify(requested.Author))
                return Unauthorized("You are not authorized to delete this post");

            return await _repository.Delete(guid) ? NoContent() : BadRequest("Delete failed! Check if the right Guid is used");
        }

        [HttpPut("{guid:Guid}")]
        [Authorize]
        public async Task<IActionResult> UpdatePost(Guid guid, [FromBody] UpdatePostCmd cmd)
        {
            var (post, error) = await GetEditablePost(guid);
            if (error is not null) return error;

            if (!DateOnly.TryParse(cmd.StartDate, out var startDate) || !DateOnly.TryParse(cmd.EndDate, out var endDate))
                return BadRequest("Update failed! Check if the parameters are correct");

            post!.Title = cmd.Title;
            post.Description = cmd.Description;
            post.StartDate = startDate;
            post.EndDate = endDate;

            await _repository.SaveChanges();
            return NoContent();
        }

        [Authorize]
        [HttpPost("upload/{guid:Guid}")]
        public async Task<IActionResult> UploadPicture(Guid guid, [FromForm] UploadPostPictureCmd cmd)
        {
            var (post, error) = await GetEditablePost(guid);
            if (error is not null) return error;

            if (cmd.Picture is null) return BadRequest("No image provided");

            return await _repository.UploadImage(post!, cmd) ? Ok() : BadRequest("Upload failed! Please check if you uploaded the right picture");
        }

        [Authorize]
        [HttpPost("upload/{guid:Guid}/day/{index:int}")]
        public async Task<IActionResult> UploadDayPicture(Guid guid, int index, [FromForm] UploadPostPictureCmd cmd)
        {
            var (post, error) = await GetEditablePost(guid);
            if (error is not null) return error;

            if (index < 0 || index >= post!.Days.Count) return NotFound("Day not found");

            if (cmd.Picture is null) return BadRequest("No image provided");

            return await _repository.UploadDayImage(post, index, cmd) ? Ok() : BadRequest("Upload failed! Please check if you uploaded the right picture");
        }

        [HttpGet("random")]
        public async Task<ActionResult<List<PostSmallDto>>> GetRandom([FromQuery] int size = 10)
        {
            if (size <= 0) return BadRequest("Size must be greater than 0");

            var authenticated = await GetAuthenticatedOrDefault();
            return Ok((await _repository.GetRandom(size))
                .Select(p => _modelConversions.ToPostSmallDto(p, p.IsLikedBy(authenticated?.Guid)))
                .ToList());
        }

        [HttpPost("like/{guid:Guid}")]
        [Authorize]
        public async Task<IActionResult> LikePost(Guid guid)
        {
            var authenticated = await GetAuthenticatedOrDefault();
            if (authenticated is null)
                return Unauthorized();

            var requested = await _repository.GetFromGuid(guid);
            if (requested is null)
                return NotFound();

            await _repository.ToggleLike(requested, authenticated);
            return Ok();
        }
    }
}
