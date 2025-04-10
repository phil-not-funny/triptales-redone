using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace Triptales.Webapi.Services
{
    public interface IFileService
    {
        Task<bool> UploadFile(IFormFile file, string fileName);
        Task<bool> DeleteFile(string fileName);
    }
}
