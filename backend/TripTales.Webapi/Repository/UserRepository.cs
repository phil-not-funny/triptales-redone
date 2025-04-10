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
                await _fileService.UploadFile(cmd.ProfilePicture, filename);
                user.ProfilePicture = $"Images/{filename}";
            }
            if (cmd.BannerImage is not null)
            {
                var filename = $"{user.Guid}-banner.jpg";
                await _fileService.UploadFile(cmd.BannerImage, filename);
                user.BannerImage = $"Images/{filename}";
            }
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
