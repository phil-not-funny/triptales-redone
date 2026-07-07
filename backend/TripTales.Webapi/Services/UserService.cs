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
using Triptales.Application.Cmd;
using Triptales.Repository;

namespace Triptales.Webapi.Services
{
    /// <summary>
    /// Business logic for user-related operations: registration, login, profile updates, follows.
    /// </summary>
    public class UserService
    {
        private readonly TripTalesContext _db;
        private readonly UserRepository _userRepository;

        public UserService(TripTalesContext db, UserRepository userRepository)
        {
            _db = db;
            _userRepository = userRepository;
        }

        /// <summary>
        /// Validates a user registration request.
        /// </summary>
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

        /// <summary>
        /// Registers a new user after validation. Returns (success, errorMessage).
        /// </summary>
        public async Task<(bool Success, string? ErrorMessage)> RegisterAsync(UserRegisterCmd cmd)
        {
            if (await _db.Users.AnyAsync(u => u.Username == cmd.Username))
                return (false, "Username already exists");

            if (await _db.Users.AnyAsync(u => u.Email == cmd.Email))
                return (false, "Email already exists");

            if (!IsUserValid(cmd, out var userCreated, out var validationResults))
            {
                var errors = string.Join("; ", validationResults.Select(r => r.ErrorMessage));
                return (false, errors);
            }

            var inserted = await _userRepository.Insert(userCreated);
            return (inserted, inserted ? null : "Registration failed. Please try again.");
        }

        /// <summary>
        /// Authenticates a user by username and password.
        /// </summary>
        public async Task<User?> AuthenticateAsync(string username, string password)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user is null || !user.CheckPassword(password))
                return null;
            return user;
        }

        /// <summary>
        /// Gets all followers of a user.
        /// </summary>
        public List<User> GetFollowers(Guid guid)
            => _db.Users.Include(u => u.Following).Where(u => u.Following.Any(f => f.Guid == guid)).ToList();

        /// <summary>
        /// Gets a user by username with all relations loaded.
        /// </summary>
        public async Task<User?> GetUserByUsername(string username) => 
            await _db.Users
                .Include(u => u.Following)
                .Include(u => u.LikedPosts)
                .Include(u => u.Posts)
                .FirstOrDefaultAsync(u => u.Username == username);

        /// <summary>
        /// Toggles follow relationship between two users.
        /// </summary>
        public async Task<bool> ToggleFollowAsync(User follower, User followee)
        {
            if (follower.Following.Any(r => r.Guid == followee.Guid))
                follower.Following.Remove(followee);
            else
                follower.Following.Add(followee);

            await _db.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Updates user profile flavor (display name, bio, location, etc.).
        /// </summary>
        public async Task<bool> UpdateFlavorAsync(User user, UserFlavorCmd cmd)
        {
            user.Username = cmd.Username;
            user.DisplayName = cmd.DisplayName;
            user.Biography = cmd.Biography;
            user.PlaceOfResidence = cmd.PlaceOfResidence;
            user.FavoriteDestination = cmd.FavoriteDestination;

            return await _userRepository.Update(user);
        }

        /// <summary>
        /// Uploads profile or banner images for a user.
        /// </summary>
        public async Task<bool> UploadImagesAsync(User user, UploadPicturesCmd cmd)
        {
            return await _userRepository.UploadImage(user, cmd);
        }
    }
}
