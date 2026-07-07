using Triptales.Application.Dtos;
using Triptales.Application.Model;
using Triptales.Webapi.Infrastructure;
using Triptales.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Triptales.Application.Cmd;

namespace Triptales.Webapi.Services
{
    /// <summary>
    /// Business logic for post-related operations: create, update, delete, like/unlike.
    /// </summary>
    public class PostService
    {
        private readonly TripTalesContext _db;
        private readonly PostRepository _repository;

        public PostService(TripTalesContext db, PostRepository repository)
        {
            _db = db;
            _repository = repository;
        }

        /// <summary>
        /// Creates a new post.
        /// </summary>
        public async Task<(bool Success, Guid? PostGuid, string? ErrorMessage)> CreatePostAsync(User author, AddPostCmd cmd)
        {
            try
            {
                var post = new Post(
                    cmd.Title,
                    cmd.Description,
                    author,
                    DateOnly.Parse(cmd.StartDate),
                    DateOnly.Parse(cmd.EndDate),
                    cmd.Days.Select(d => new Post.Day(d.Title, d.Description, DateOnly.Parse(d.Date))).ToList()
                );

                var inserted = await _repository.Insert(post);
                return (inserted, inserted ? post.Guid : null, inserted ? null : "Failed to create post");
            }
            catch (Exception ex)
            {
                return (false, null, $"Error creating post: {ex.Message}");
            }
        }

        /// <summary>
        /// Deletes a post if the user is the author.
        /// </summary>
        public async Task<(bool Success, string? ErrorMessage)> DeletePostAsync(Guid postGuid, User requester)
        {
            var post = await _repository.GetFromGuid(postGuid);
            if (post is null)
                return (false, "Post not found");

            if (post.Author.Guid != requester.Guid)
                return (false, "You are not authorized to delete this post");

            var deleted = await _repository.Delete(postGuid);
            return (deleted, deleted ? null : "Failed to delete post");
        }

        /// <summary>
        /// Updates a post if the user is the author.
        /// </summary>
        public async Task<(bool Success, string? ErrorMessage)> UpdatePostAsync(Guid postGuid, UpdatePostCmd cmd, User requester)
        {
            var post = await _db.Posts.Include(p => p.Author).FirstOrDefaultAsync(p => p.Guid == postGuid);
            if (post is null)
                return (false, "Post not found");

            if (post.Author.Guid != requester.Guid)
                return (false, "You are not authorized to update this post");

            try
            {
                var updated = new Post(cmd.Title, cmd.Description, post.Author, DateOnly.Parse(cmd.StartDate), DateOnly.Parse(cmd.EndDate));
                updated.Guid = postGuid;
                var success = await _repository.Update(updated);
                return (success, success ? null : "Failed to update post");
            }
            catch (Exception ex)
            {
                return (false, $"Error updating post: {ex.Message}");
            }
        }

        /// <summary>
        /// Toggles like status of a post for a user.
        /// </summary>
        public async Task<bool> ToggleLikeAsync(Guid postGuid, User user)
        {
            var post = await _repository.GetFromGuid(postGuid);
            if (post is null)
                return false;

            if (post.Likes.Any(u => u.Guid == user.Guid))
                post.Likes.Remove(user);
            else
                post.Likes.Add(user);

            await _db.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Gets all posts (with optional randomization).
        /// </summary>
        public async Task<List<Post>> GetAllPostsAsync()
        {
            return await _repository.GetAll();
        }

        /// <summary>
        /// Gets a random selection of posts.
        /// </summary>
        public async Task<List<Post>> GetRandomPostsAsync(int size = 10)
        {
            if (size <= 0)
                return new List<Post>();

            var random = new Random();
            var posts = await _db.Posts
                .Include(p => p.Author)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .ToListAsync();

            return posts.OrderBy(_ => random.Next()).Take(size).ToList();
        }

        /// <summary>
        /// Gets a single post by GUID.
        /// </summary>
        public async Task<Post?> GetPostByGuidAsync(Guid guid)
        {
            return await _repository.GetFromGuid(guid);
        }
    }
}
