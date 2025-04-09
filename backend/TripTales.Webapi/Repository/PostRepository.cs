using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Triptales.Application.Cmd;
using Triptales.Application.Model;
using Triptales.Webapi.Infrastructure;
using Triptales.Application.Dtos;
using Triptales.Webapi.Services;

namespace Triptales.Repository
{
    public class PostRepository : ICrudRepository<Post>
    {
        private readonly TripTalesContext _db;
        private readonly UserService _userService;
        public PostRepository(TripTalesContext db, UserService userService)
        {
            _db = db;
            _userService = userService;
        }

        public async Task<bool> Delete(Guid guid)
        {
            var post = await _db.Posts.FirstOrDefaultAsync(a => a.Guid == guid);
            if (post is null) return false;
            _db.Posts.Remove(post);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<Post>> GetAll() => 
            await _db.Posts.Include(a => a.Author).Include(a => a.Likes).ToListAsync();

        public async Task<Post?> GetFromGuid(Guid guid) => 
            await _db.Posts.Include(a => a.Author).Include(a => a.Likes).FirstAsync(a => a.Guid == guid);

        public async Task<PostDto?> GetFromGuidToPostDto(Guid guid)
        {
            var post = await _db.Posts
                .Include(p => p.Author)
                .Include(p => p.Likes)
                .FirstOrDefaultAsync(p => p.Guid == guid);

            if (post is null)
                return null;

            return new PostDto(
                post.Guid,
                post.Title,
                post.Description,
                new UserPublicSmallDto(
                    post.Author.Guid,
                    post.Author.Username,
                    post.Author.DisplayName,
                    post.Author.Verified
                ),
                post.StartDate.ToString(),
                post.EndDate.ToString(),
                post.CreatedAt.ToString(),
                post.Likes.Count
            );
        }

        public async Task<bool> Insert(Post entity)
        {
            _db.Posts.Add(entity);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Update(Post entity)
        {
            _db.Posts.Update(entity);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
