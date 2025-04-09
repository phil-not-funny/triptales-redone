using Triptales.Application.Model;
using Triptales.Webapi.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Triptales.Application.Dtos;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Castle.DynamicProxy.Generators.Emitters.SimpleAST;
using System.Linq;

namespace Triptales.Application.Services
{
    public class UserService
    {
        private readonly TripTalesContext _db;

        public UserService(TripTalesContext db)
        {
            _db = db;
        }

        public UserPublicSmallDto ConvertToPublicSmall(User user) => 
            new UserPublicSmallDto(user.Guid, user.Username, user.DisplayName, user.Verified);
        public UserPublicDto ConvertToPublic(User user) => new UserPublicDto(
            user.Guid, user.Username, user.DisplayName, user.Verified,
            user.Following.Count > 0 ? user.Following.Select(u => ConvertToPublicSmall(u)).ToList() : new());
        public UserPrivateDto ConvertToPrivate(User user) => 
            new UserPrivateDto(user.Guid, user.Username, user.DisplayName, user.Email);

        public bool IsUserValid(UserRegisterCmd user, out User createdUser, out List<ValidationResult> results)
        {
            createdUser = new User(user.Username, user.Email, user.Password, user.DisplayName);
            var context = new ValidationContext(createdUser);
            results = new List<ValidationResult>();
            return Validator.TryValidateObject(createdUser, context, results, true);
        }

        public async Task<User?> GetUserByUsername(string username) => (await _db.Users.Include(u => u.Following).FirstOrDefaultAsync(u => u.Username == username));
    }
}
