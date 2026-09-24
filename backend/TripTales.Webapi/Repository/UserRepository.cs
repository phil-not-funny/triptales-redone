using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Triptales.Webapi.Infrastructure;
using Triptales.Application.Model;
using Triptales.Application.Cmd;
using Triptales.Webapi.Services;

namespace Triptales.Repository
{
    public class UserRepository : ICrudRepository<User>
    {
        private readonly TripTalesContext _db;
        private readonly IFileService _fileService;

        public UserRepository(TripTalesContext db, IFileService fileService)
        {
            _db = db;
            _fileService = fileService;
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

        public async Task<User?> FindByUsername(string username) =>
            await _db.Users.FirstOrDefaultAsync(u => u.Username == username);

        public Task<bool> UsernameExists(string username) => _db.Users.AnyAsync(u => u.Username == username);

        public Task<bool> EmailExists(string email) => _db.Users.AnyAsync(u => u.Email == email);

        /// <summary>
        /// Makes <paramref name="follower"/> follow <paramref name="target"/>, or unfollow if already following.
        /// </summary>
        public async Task ToggleFollow(User follower, User target)
        {
            follower.Following.Toggle(target);
            await _db.SaveChangesAsync();
        }

        /// <summary>
        /// Sets the verified flag of a user.
        /// </summary>
        /// <returns><c>false</c> if no user with the given guid exists.</returns>
        public async Task<bool> SetVerified(Guid guid, bool verified)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Guid == guid);
            if (user is null) return false;

            user.Verified = verified;
            await _db.SaveChangesAsync();
            return true;
        }

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

        public async Task<bool> UploadImage(User user, UploadPicturesCmd cmd)
        {
            if (cmd.ProfilePicture is not null)
            {
                var filename = $"{user.Guid}-profile.jpg";
                if (!await _fileService.UploadFile(cmd.ProfilePicture, filename)) return false;
                user.ProfilePicture = $"Images/{filename}";
            }
            if (cmd.BannerImage is not null)
            {
                var filename = $"{user.Guid}-banner.jpg";
                if (!await _fileService.UploadFile(cmd.BannerImage, filename)) return false;
                user.BannerImage = $"Images/{filename}";
            }
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
