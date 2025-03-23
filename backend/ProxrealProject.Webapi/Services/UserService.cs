using Triptales.Application.Cmd;
using Triptales.Webapi.Model;
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
        private readonly ProxrealContext _db;

        public UserService(ProxrealContext db)
        {
            _db = db;
        }

        public UserPublicCmdSmall ConvertToPublicSmall(User user) => 
            new UserPublicCmdSmall(user.Guid, user.Username, user.DisplayName, user.Verified);
        public UserPublicCmd ConvertToPublic(User user) => new UserPublicCmd(
            user.Guid, user.Username, user.DisplayName, user.Verified,
            user.Following.Count > 0 ? user.Following.Select(u => ConvertToPublicSmall(u)).ToList() : new());
        public UserPrivateCmd ConvertToPrivate(User user) => 
            new UserPrivateCmd(user.Guid, user.Username, user.DisplayName, user.Email);

        public bool IsUserValid(UserRegisterDto user, out User createdUser, out List<ValidationResult> results)
        {
            createdUser = new User(user.Username, user.Email, user.Password, user.DisplayName);
            var context = new ValidationContext(createdUser);
            results = new List<ValidationResult>();
            return Validator.TryValidateObject(createdUser, context, results, true);
        }

        public async Task<User?> GetUserByUsername(string username) => (await _db.Users.Include(u => u.Following).FirstOrDefaultAsync(u => u.Username == username));
    }
}
