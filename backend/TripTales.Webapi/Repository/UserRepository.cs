using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Triptales.Webapi.Infrastructure;
using Triptales.Application.Model;

namespace Triptales.Repository
{
    public class UserRepository : ICrudRepository<User>
    {
        private readonly TripTalesContext _db;

        public UserRepository(TripTalesContext db)
        {
            _db = db;
        }

        public async Task<bool> Delete(Guid guid)
        {
            _db.Users.Remove(await _db.Users.FirstAsync(a => a.Guid == guid));
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<User>> GetAll() => await _db.Users.ToListAsync();

        public async Task<User?> GetFromGuid(Guid guid) => 
            await _db.Users.Include(a => a.Posts).Include(a => a.LikedPosts).Include(a => a.Following).FirstOrDefaultAsync(u => u.Guid == guid);

        public async Task<bool> Insert(User entity)
        {
            _db.Users.Add(entity);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Update(User entity)
        {
            _db.Users.Update(entity);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
