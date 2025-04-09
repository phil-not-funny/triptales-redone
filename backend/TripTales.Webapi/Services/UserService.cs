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
        private readonly PostService _postService;

        public UserService(TripTalesContext db, PostService postService)
        {
            _db = db;
            _postService = postService;
        }

        /**
         * Converts a User object to a UserDetailedDto object.
         * @require Include Post
         * @param user The User object to convert.
         * @return A UserDetailedDto object containing the user's details.
         */
        public UserDetailedDto ConvertToDetailed(User user) =>
            new(
                user.Username, user.Email, user.DisplayName, user.Verified,
                user.Biography, user.PlaceOfResidence, user.FavoriteDestination,
                user.MemberSince.ToString(),
                GetFollowers(user.Guid).Count,
                user.Posts.Count > 0 ? user.Posts.Select(p => _postService.ConvertToPostDto(p)).ToList() : new()
            );

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

        public List<User> GetFollowers(Guid guid)
            => _db.Users.Include(u => u.Following).Where(u => u.Following.Any(f => f.Guid == guid)).ToList();

        public async Task<User?> GetUserByUsername(string username) => (await _db.Users.Include(u => u.Following).FirstOrDefaultAsync(u => u.Username == username));
    }
}
