﻿using Microsoft.AspNetCore.Mvc;
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

        private async Task<User?> getAuthenticatedOrDefault()
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
            var authenticated = await getAuthenticatedOrDefault();
            return Ok((await _repository.GetAll()).Select(a => _modelConversions.ConvertToPostSmallDto(
                a,
                authenticated is not null && authenticated.LikedPosts.Any(p => p.Guid == a.Guid))).ToList());
        }

        [HttpGet("{guid:Guid}")]
        public async Task<ActionResult<PostDto>> GetPost(Guid guid)
        {
            var authenticated = await getAuthenticatedOrDefault();
            return await _repository.GetFromGuid(guid) is Post post ? Ok(_modelConversions.ConvertToPostDto(
                post, 
                authenticated is not null && authenticated.LikedPosts.Any(p => p.Guid == post.Guid)
                )) : BadRequest("Post not found");
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> AddPost([FromBody] AddPostCmd cmd)
        {
            var user = await getAuthenticatedOrDefault();
            if (user is null) return Unauthorized("User not authenticated");
            var post = new Post(cmd.Title, cmd.Description, user, DateOnly.Parse(cmd.StartDate), DateOnly.Parse(cmd.EndDate), cmd.Days.Select(d => new Post.Day(d.Title, d.Description, DateOnly.Parse(d.Date))).ToList());
            return await _repository.Insert(post) ? Ok(post.Guid) : BadRequest("Insert failed! Check if the parameters are correct");
        }

        [HttpDelete("{guid:Guid}")]
        public async Task<ActionResult> DeletePost(Guid guid) =>
            await _repository.Delete(guid) ? NoContent() : BadRequest("Delete failed! Check if the right Guid is used");

        [HttpPut("{guid:Guid}")]
        public async Task<ActionResult> UpdatePost(Guid guid, [FromBody] UpdatePostCmd cmd)
        {
            var p = await _db.Posts.Include(a => a.Author).FirstOrDefaultAsync(p => p.Guid == guid);
            if (p is null) return NotFound("Post not found");
            var post = new Post(cmd.Title, cmd.Description, p.Author, DateOnly.Parse(cmd.StartDate), DateOnly.Parse(cmd.EndDate));
            post.Guid = guid;
            return await _repository.Update(post) ? NoContent() : BadRequest("Update failed! Check if the parameters are correct");
        }

        [HttpGet("random")]
        public async Task<ActionResult<List<PostSmallDto>>> GetRandom([FromQuery] int size = 10)
        {
            if (size <= 0) return BadRequest("Size must be greater than 0");

            var authenticated = await getAuthenticatedOrDefault();

            Random rand = new Random();
            var take = (await _db.Posts.Include(a => a.Author)
                .ToListAsync()).OrderBy(p => rand.Next())
                .Take(size)
                .Select(p =>
                    _modelConversions.ConvertToPostSmallDto(
                        p,
                        authenticated is not null && authenticated.LikedPosts.Any(a => a.Guid == p.Guid))).ToList();
            return Ok(take);
        }

        [HttpPost("like/{guid:Guid}")]
        [Authorize]
        public async Task<IActionResult> LikePost(Guid guid)
        {
            var authenticated = await getAuthenticatedOrDefault();
            if (authenticated is null)
                return Unauthorized();

            var requested = await _repository.GetFromGuid(guid);
            if (requested is null)
                return NotFound();

            if (authenticated.LikedPosts.Any(p => p.Guid == guid))
                authenticated.LikedPosts.Remove(requested);
            else
                authenticated.LikedPosts.Add(requested);
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
