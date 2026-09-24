using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Triptales.Application.Cmd;
using Triptales.Application.Model;
using Triptales.Webapi.Infrastructure;
using Triptales.Webapi.Services;

namespace Triptales.Repository
{
    public class PostRepository : ICrudRepository<Post>
    {
        private readonly TripTalesContext _db;
        private readonly CommentRepository _comments;
        private readonly IFileService _fileService;

        public PostRepository(TripTalesContext db, CommentRepository comments, IFileService fileService)
        {
            _db = db;
            _comments = comments;
            _fileService = fileService;
        }

        public async Task<bool> Delete(Guid guid)
        {
            var post = await _db.Posts
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Guid == guid);
            if (post is null) return false;

            // Every foreign key is RESTRICT (see TripTalesContext.OnModelCreating) - that loop
            // also rewrites the owned Day rows and the join tables - so nothing cascades and
            // every dependent has to be removed explicitly before the post itself.
            post.Likes.Clear();
            _db.RemoveRange(post.Days.ToList());
            foreach (var comment in post.Comments.ToList())
                await _comments.RemoveWithDescendants(comment);

            _db.Posts.Remove(post);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<Post>> GetAll() =>
            await _db.Posts.Include(p => p.Author).Include(p => p.Likes).Include(p => p.Comments).ToListAsync();

        public async Task<Post?> GetFromGuid(Guid guid) =>
            await _db.Posts
            .Include(p => p.Author)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
                .ThenInclude(c => c.Author)
            .Include(p => p.Comments)
                .ThenInclude(c => c.Likes)
            .Include(p => p.Comments)
                .ThenInclude(c => c.Comments)
            .FirstOrDefaultAsync(p => p.Guid == guid);

        public async Task<Post?> GetWithAuthor(Guid guid) =>
            await _db.Posts.Include(p => p.Author).FirstOrDefaultAsync(p => p.Guid == guid);

        /// <summary>
        /// Returns up to <paramref name="size"/> posts in random order.
        /// </summary>
        public async Task<List<Post>> GetRandom(int size)
        {
            var random = new Random();
            var posts = await GetAll();
            return posts.OrderBy(_ => random.Next()).Take(size).ToList();
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

        /// <summary>
        /// Persists changes already applied to a tracked post.
        /// </summary>
        public Task SaveChanges() => _db.SaveChangesAsync();

        /// <summary>
        /// Adds <paramref name="user"/> to the likes of <paramref name="post"/>, or removes the like if it exists.
        /// </summary>
        public async Task ToggleLike(Post post, User user)
        {
            post.Likes.Toggle(user);
            await _db.SaveChangesAsync();
        }

        public async Task<bool> UploadImage(Post post, UploadPostPictureCmd cmd)
        {
            if (cmd.Picture is not null)
            {
                var filename = $"{post.Guid}-post.jpg";
                if (!await _fileService.UploadFile(cmd.Picture, filename)) return false;
                post.Picture = $"Images/{filename}";
            }
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UploadDayImage(Post post, int index, UploadPostPictureCmd cmd)
        {
            if (cmd.Picture is not null)
            {
                var filename = $"{post.Guid}-day-{index}.jpg";
                if (!await _fileService.UploadFile(cmd.Picture, filename)) return false;
                post.Days[index].Picture = $"Images/{filename}";
            }
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
