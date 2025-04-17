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
        public PostRepository(TripTalesContext db)
        {
            _db = db;
        }

        public async Task<bool> Delete(Guid guid)
        {
            var post = await _db.Posts.FirstOrDefaultAsync(p => p.Guid == guid);
            if (post is null) return false;
            _db.Posts.Remove(post);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<Post>> GetAll() => 
            await _db.Posts.Include(p => p.Author).Include(p => p.Likes).Include(p => p.Comments).ToListAsync();

        public async Task<Post?> GetFromGuid(Guid guid) => 
            await _db.Posts.Include(p => p.Author).Include(p => p.Likes).Include(p => p.Comments).ThenInclude(c => c.Author).FirstOrDefaultAsync(p => p.Guid == guid);

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
