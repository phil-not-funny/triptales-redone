using Microsoft.AspNetCore.Http;

namespace Triptales.Application.Cmd
{
    public record UploadPicturesCmd(IFormFile? ProfilePicture, IFormFile? BannerImage);
}
