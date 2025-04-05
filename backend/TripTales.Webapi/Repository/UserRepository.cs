using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Triptales.Webapi.Infrastructure;
using Triptales.Application.Model;

namespace proxreal_backend.Repository
{
    public class UserRepository : ICrudRepository<User>
    {
        private readonly TripTalesContext _db;

        public UserRepository(TripTalesContext db)
        {
            _db = db;
        }

        public async void Delete(User entity)
        {
            _db.Users.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<List<User>> GetAll() => (await _db.Users.ToListAsync());

        public async Task<User?> GetFromGuid(Guid guid) => (await _db.Users.FirstOrDefaultAsync(u => u.Guid == guid));

        public async void Insert(User entity)
        {
            await _db.Users.AddAsync(entity);
            await _db.SaveChangesAsync();
        }

        public async void Update(User entity)
        {
            _db.Users.Update(entity);
            await _db.SaveChangesAsync();
        }
    }
}
