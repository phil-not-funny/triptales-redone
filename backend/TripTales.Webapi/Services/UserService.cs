using Triptales.Application.Model;
using Triptales.Webapi.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Triptales.Webapi.Dtos;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System;

namespace Triptales.Webapi.Services
{
    public class UserService
    {
        private readonly TripTalesContext _db;

        public UserService(TripTalesContext db)
        {
            _db = db;
        }

        public bool IsUserValid(UserRegisterCmd user, out User createdUser, out List<ValidationResult> results)
        {
            createdUser = new User(user.Username, user.Email, user.Password, user.DisplayName);
            var context = new ValidationContext(createdUser);
            results = new();
            return Validator.TryValidateObject(createdUser, context, results, true);
        }

        public List<User> GetFollowers(Guid guid)
            => _db.Users.Include(u => u.Following).Where(u => u.Following.Any(f => f.Guid == guid)).ToList();

        public async Task<User?> GetUserByUsername(string username) => await _db.Users.Include(u => u.Following).FirstOrDefaultAsync(u => u.Username == username);
    }
}
