using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Triptales.Application.Model;
using Triptales.Webapi.Infrastructure;

namespace Triptales.Repository
{
    public class CommentRepository : ICrudRepository<Comment>
    {
        private readonly TripTalesContext _db;
        public CommentRepository(TripTalesContext db)
        {
            _db = db;
        }

        public async Task<bool> Delete(Guid guid)
        {
            var comment = await _db.Comments.FirstOrDefaultAsync(c => c.Guid == guid);
            if (comment is null) return false;
            _db.Comments.Remove(comment);
            await _db.SaveChangesAsync();
            return true;
        }

        public Task<List<Comment>> GetAll() =>
            _db.Comments.Include(c => c.Comments)
            .Include(c => c.Author)
            .Include(c => c.Post)
            .Include(c => c.Likes)
            .Include(c => c.Parent)
            .ToListAsync();


        public Task<Comment?> GetFromGuid(Guid guid) =>
            _db.Comments
            .Include(c => c.Comments)
                .ThenInclude(c => c.Comments)
            .Include(c => c.Comments)
                .ThenInclude(c => c.Author)
            .Include(c => c.Author)
            .Include(c => c.Post)
            .Include(c => c.Likes)
            .Include(c => c.Parent)
            .FirstOrDefaultAsync(c => c.Guid == guid);


        public Task<bool> Insert(Comment entity)
        {
            _db.Comments.Add(entity);
            return _db.SaveChangesAsync().ContinueWith(t => t.Result > 0);
        }

        public Task<bool> Update(Comment entity)
        {
            _db.Comments.Update(entity);
            return _db.SaveChangesAsync().ContinueWith(t => t.Result > 0);
        }
    }
}
