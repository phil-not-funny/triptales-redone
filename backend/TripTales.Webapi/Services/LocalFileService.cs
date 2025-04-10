using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;

namespace Triptales.Webapi.Services
{
    public class LocalFileService : IFileService
    {
        public LocalFileService()
        {
            // Constructor logic if needed
        }

        public Task<bool> DeleteFile(string fileName)
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), "Images", fileName);
            if (File.Exists(path))
            {
                File.Delete(path);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }

        public async Task<bool> UploadFile(IFormFile file, string fileName)
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), "Images", fileName);
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return true;
        }
    }
}