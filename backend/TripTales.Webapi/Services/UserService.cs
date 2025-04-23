using Triptales.Application.Model;
using Triptales.Webapi.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Triptales.Application.Dtos;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Castle.DynamicProxy.Generators.Emitters.SimpleAST;
using System.Linq;
using System;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;

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
            var regex = @"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$";
            bool isPasswordValid = user.Password.Length >= 8 && Regex.IsMatch(user.Password, regex);
            if (!isPasswordValid)
                results.Add(new ValidationResult(
                    "Password must contain a minimum of eight characters, at least one lower- and uppercase letter, number and special character",
                    new[] { nameof(user.Password) }));
            bool isValid = Validator.TryValidateObject(createdUser, context, results, true);
            return isPasswordValid && isValid;
        }

        public List<User> GetFollowers(Guid guid)
            => _db.Users.Include(u => u.Following).Where(u => u.Following.Any(f => f.Guid == guid)).ToList();

        public async Task<User?> GetUserByUsername(string username) => await _db.Users.Include(u => u.Following).Include(u => u.LikedPosts).Include(u => u.Posts).FirstOrDefaultAsync(u => u.Username == username);
    }
}
