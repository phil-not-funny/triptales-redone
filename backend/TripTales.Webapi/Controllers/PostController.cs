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

        [HttpGet]
        public async Task<ActionResult<List<PostDto>>> GetPosts() =>
            Ok((await _repository.GetAll()).Select(a => _modelConversions.ConvertToPostDto(a)).ToList());

        [HttpGet("{guid:Guid}")]
        public async Task<ActionResult<PostDto>> GetPost(Guid guid) =>
            await _repository.GetFromGuidToPostDto(guid) is PostDto post ? Ok(post) : BadRequest("Post not found");

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

        [HttpPut("{guid:Guid}")]
        public async Task<ActionResult> UpdatePost(Guid guid, [FromBody] UpdatePostCmd cmd)
        {
            var p = await _db.Posts.Include(a => a.Author).FirstOrDefaultAsync(p => p.Guid == guid);
            if (p is null) return NotFound("Post not found");
            var post = new Post(cmd.Title, cmd.Description, p.Author, DateTime.Parse(cmd.StartDate), DateTime.Parse(cmd.EndDate));
            post.Guid = guid;
            return await _repository.Update(post) ? NoContent() : BadRequest("Update failed! Check if the parameters are correct");
        }

        [HttpGet("random")]
        public async Task<ActionResult<List<PostDto>>> GetRandom([FromQuery] int size = 10)
        {
            Random rand = new Random();
            var take = (await _db.Posts.Include(a => a.Author)
                .ToListAsync()).OrderBy(p => rand.Next())
                .Take(size)
                .Select(p => _modelConversions.ConvertToPostDto(p)).ToList();
            return Ok(take);
        }
    }
}
