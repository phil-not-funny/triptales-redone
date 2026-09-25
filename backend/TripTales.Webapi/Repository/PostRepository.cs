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

        /// <summary>
        /// Finds posts whose title, description or author's username contains <paramref name="term"/> (case-insensitive), newest first.
        /// </summary>
        public async Task<List<Post>> Search(string term, int limit)
        {
            var lowered = term.ToLower();
            return await _db.Posts
                .Include(p => p.Author).Include(p => p.Likes).Include(p => p.Comments)
                .Where(p => p.Title.ToLower().Contains(lowered)
                    || p.Description.ToLower().Contains(lowered)
                    || p.Author.Username.ToLower().Contains(lowered))
                .OrderByDescending(p => p.CreatedAt)
                .Take(limit)
                .ToListAsync();
        }

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

        /// <summary>
        /// Stores an uploaded picture and appends it to the pictures of the post.
        /// </summary>
        public async Task<bool> UploadImage(Post post, UploadPostPictureCmd cmd)
        {
            var path = await StorePicture(cmd, $"{post.Guid}-post");
            if (path is null) return false;

            post.Pictures.Add(path);
            await _db.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Stores an uploaded picture and appends it to the pictures of the day at <paramref name="index"/>.
        /// </summary>
        public async Task<bool> UploadDayImage(Post post, int index, UploadPostPictureCmd cmd)
        {
            var path = await StorePicture(cmd, $"{post.Guid}-day-{index}");
            if (path is null) return false;

            post.Days[index].Pictures.Add(path);
            await _db.SaveChangesAsync();
            return true;
        }

        /// <returns>The public path of the stored file, or <c>null</c> if it could not be stored.</returns>
        private async Task<string?> StorePicture(UploadPostPictureCmd cmd, string namePrefix)
        {
            if (cmd.Picture is null) return null;

            // A post can hold any number of pictures, so every file needs its own name.
            var filename = $"{namePrefix}-{Guid.NewGuid():N}.jpg";
            return await _fileService.UploadFile(cmd.Picture, filename) ? $"Images/{filename}" : null;
        }
    }
}
