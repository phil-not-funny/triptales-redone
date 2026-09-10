using Microsoft.AspNetCore.Http;

namespace Triptales.Application.Cmd
{
    public record UploadPostPictureCmd(IFormFile? Picture);
}
