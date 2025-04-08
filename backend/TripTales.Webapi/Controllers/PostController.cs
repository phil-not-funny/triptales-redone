using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripTales.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Triptales.Application.Cmd;
using Triptales.Application.Model;
using Triptales.Application.Services;
using Triptales.Webapi.Infrastructure;

namespace TripTales.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly TripTalesContext _db;
        private readonly UserService _userService;
        private readonly PostRepository _repository;

        public PostController(TripTalesContext db, UserService userService, PostRepository repository)
        {
            _db = db;
            _userService = userService;
            _repository = repository;
        }

        public record PostDto(Guid Guid, string Title, string Description, UserPublicCmdSmall Author, string StartDate, string EndDate, string Created, int LikesCount);
        [HttpGet]
        public async Task<ActionResult<List<PostDto>>> GetPosts() =>
            Ok((await _repository.GetAll()).Select(a => new PostDto(
                a.Guid,
                a.Title,
                a.Description,
                _userService.ConvertToPublicSmall(a.Author),
                a.StartDate.ToString(),
                a.EndDate.ToString(),
                a.CreatedAt.ToString(),
                a.Likes.Count)).ToList());

        [HttpGet("{guid:Guid}")]
        public async Task<ActionResult<PostDto>> GetPost(Guid guid) =>
            await _repository.GetFromGuidToPostDto(guid) is PostDto post ? Ok(post) : BadRequest("Post not found");

        public record AddPostCmd(string Title, string Description, Guid AuthorGuid, string StartDate, string EndDate);
        [HttpPost]
        public async Task<ActionResult> AddPost([FromBody] AddPostCmd cmd)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Guid == cmd.AuthorGuid);
            if (user is null) return NotFound("User doesn't exist");
            return await _repository.Insert(new Post(cmd.Title, cmd.Description, user, DateTime.Parse(cmd.StartDate), DateTime.Parse(cmd.EndDate))) ? Ok() : BadRequest("Insert failed! Check if the parameters are correct");
        }

        [HttpDelete("{guid:Guid}")]
        public async Task<ActionResult> DeletePost(Guid guid) =>
            await _repository.Delete(guid) ? NoContent() : BadRequest("Delete failed! Check if the right Guid is used");

        public record UpdatePostCmd(string Title, string Description, string StartDate, string EndDate);
        [HttpPut("{guid:Guid}")]
        public async Task<ActionResult> UpdatePost(Guid guid, [FromBody] UpdatePostCmd cmd)
        {
            var p = await _db.Posts.Include(a => a.Author).FirstOrDefaultAsync(p => p.Guid == guid);
            if (p is null) return NotFound("Post not found");
            var post = new Post(cmd.Title, cmd.Description, p.Author, DateTime.Parse(cmd.StartDate), DateTime.Parse(cmd.EndDate));
            post.Guid = guid;
            return await _repository.Update(post) ? NoContent() : BadRequest("Update failed! Check if the parameters are correct");
        }
    }
}
