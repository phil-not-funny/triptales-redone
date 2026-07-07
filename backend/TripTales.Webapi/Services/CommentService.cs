using Triptales.Application.Cmd;
using Triptales.Application.Model;
using Triptales.Repository;
using Triptales.Webapi.Infrastructure;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Triptales.Webapi.Services
{
    /// <summary>
    /// Business logic for comment-related operations: create, delete, like/unlike.
    /// </summary>
    public class CommentService
    {
        private readonly TripTalesContext _db;
        private readonly CommentRepository _repository;
        private readonly PostRepository _postRepository;

        public CommentService(TripTalesContext db, CommentRepository repository, PostRepository postRepository)
        {
            _db = db;
            _repository = repository;
            _postRepository = postRepository;
        }

        /// <summary>
        /// Creates a new comment on a post or as a reply to another comment.
        /// </summary>
        public async Task<(bool Success, Comment? Comment, string? ErrorMessage)> CreateCommentAsync(User author, AddCommentCmd cmd)
        {
            if (cmd.Post is null && cmd.Parent is null)
                return (false, null, "Post or Parent must be specified");

            try
            {
                var post = cmd.Post.HasValue ? await _postRepository.GetFromGuid(cmd.Post.Value) : null;
                var parent = cmd.Parent.HasValue ? await _repository.GetFromGuid(cmd.Parent.Value) : null;

                var comment = new Comment(author, cmd.Content, parent, post);
                var inserted = await _repository.Insert(comment);

                return (inserted, inserted ? comment : null, inserted ? null : "Failed to create comment");
            }
            catch (Exception ex)
            {
                return (false, null, $"Error creating comment: {ex.Message}");
            }
        }

        /// <summary>
        /// Deletes a comment if the user is the author.
        /// </summary>
        public async Task<(bool Success, string? ErrorMessage)> DeleteCommentAsync(Guid commentGuid, User requester)
        {
            var comment = await _repository.GetFromGuid(commentGuid);
            if (comment is null)
                return (false, "Comment does not exist");

            if (comment.Author.Guid != requester.Guid)
                return (false, "You are not the author of this comment");

            var deleted = await _repository.Delete(commentGuid);
            return (deleted, deleted ? null : "Failed to delete comment");
        }

        /// <summary>
        /// Toggles like status of a comment for a user.
        /// </summary>
        public async Task<bool> ToggleLikeAsync(Guid commentGuid, User user)
        {
            var comment = await _repository.GetFromGuid(commentGuid);
            if (comment is null)
                return false;

            if (comment.Likes.Any(u => u.Guid == user.Guid))
                comment.Likes.Remove(user);
            else
                comment.Likes.Add(user);

            await _db.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Gets a comment by GUID.
        /// </summary>
        public async Task<Comment?> GetCommentByGuidAsync(Guid guid)
        {
            return await _repository.GetFromGuid(guid);
        }
    }
}
