using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Triptales.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Triptales.Application.Model;
using Triptales.Webapi.Infrastructure;
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
        private readonly TripTalesContext _db;
        private readonly UserService _userService;
        private readonly PostService _postService;
        private readonly ModelConversions _modelConversions;
        private readonly PostRepository _repository;

        public PostController(TripTalesContext db, UserService userService, PostRepository repository, PostService postService, ModelConversions modelConversions)
        {
            _db = db;
            _userService = userService;
            _repository = repository;
            _postService = postService;
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

        [HttpGet]
        public async Task<ActionResult<List<PostSmallDto>>> GetPosts()
        {
            var authenticated = await GetAuthenticatedOrDefault();
            return Ok((await _repository.GetAll()).Select(a => _modelConversions.ToPostSmallDto(
                a,
                authenticated is not null && a.Likes.Any(u => u.Guid == authenticated.Guid))).ToList());
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
            return Ok(_modelConversions.ToPostDto(
                post,
                authenticated is not null && post.Likes.Any(u => u.Guid == authenticated.Guid)));
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
        public async Task<ActionResult> UpdatePost(Guid guid, [FromBody] UpdatePostCmd cmd)
        {
            var authenticated = await GetAuthenticatedOrDefault();
            if (authenticated is null)
                return Unauthorized("User not authenticated");

            var post = await _db.Posts.Include(a => a.Author).FirstOrDefaultAsync(p => p.Guid == guid);
            if (post is null) return NotFound("Post not found");

            if (!authenticated.CanModify(post.Author))
                return Unauthorized("You are not authorized to edit this post");

            if (!DateOnly.TryParse(cmd.StartDate, out var startDate) || !DateOnly.TryParse(cmd.EndDate, out var endDate))
                return BadRequest("Update failed! Check if the parameters are correct");

            post.Title = cmd.Title;
            post.Description = cmd.Description;
            post.StartDate = startDate;
            post.EndDate = endDate;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpPost("upload/{guid:Guid}")]
        public async Task<IActionResult> UploadPicture(Guid guid, [FromForm] UploadPostPictureCmd cmd)
        {
            var authenticated = await GetAuthenticatedOrDefault();
            if (authenticated is null) return Unauthorized("User not authenticated");

            var post = await _db.Posts.Include(p => p.Author).FirstOrDefaultAsync(p => p.Guid == guid);
            if (post is null) return NotFound("Post not found");

            if (!authenticated.CanModify(post.Author))
                return Unauthorized("You are not authorized to edit this post");

            if (cmd.Picture is null) return BadRequest("No image provided");

            return await _repository.UploadImage(post, cmd) ? Ok() : BadRequest("Upload failed! Please check if you uploaded the right picture");
        }

        [Authorize]
        [HttpPost("upload/{guid:Guid}/day/{index:int}")]
        public async Task<IActionResult> UploadDayPicture(Guid guid, int index, [FromForm] UploadPostPictureCmd cmd)
        {
            var authenticated = await GetAuthenticatedOrDefault();
            if (authenticated is null) return Unauthorized("User not authenticated");

            var post = await _db.Posts.Include(p => p.Author).FirstOrDefaultAsync(p => p.Guid == guid);
            if (post is null) return NotFound("Post not found");

            if (!authenticated.CanModify(post.Author))
                return Unauthorized("You are not authorized to edit this post");

            if (index < 0 || index >= post.Days.Count) return NotFound("Day not found");

            if (cmd.Picture is null) return BadRequest("No image provided");

            return await _repository.UploadDayImage(post, index, cmd) ? Ok() : BadRequest("Upload failed! Please check if you uploaded the right picture");
        }

        [HttpGet("random")]
        public async Task<ActionResult<List<PostSmallDto>>> GetRandom([FromQuery] int size = 10)
        {
            if (size <= 0) return BadRequest("Size must be greater than 0");

            var authenticated = await GetAuthenticatedOrDefault();

            Random rand = new Random();
            var take = (await _db.Posts.Include(p => p.Author)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .ToListAsync()).OrderBy(p => rand.Next())
                .Take(size)
                .Select(p =>
                    _modelConversions.ToPostSmallDto(
                        p,
                        authenticated is not null && p.Likes.Any(u => u.Guid == authenticated.Guid))).ToList();
            return Ok(take);
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

            if (requested.Likes.Any(u => u.Guid == authenticated.Guid))
                requested.Likes.Remove(authenticated);
            else
                requested.Likes.Add(authenticated);
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
