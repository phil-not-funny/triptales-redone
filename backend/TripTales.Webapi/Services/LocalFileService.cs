using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;
using System.IO;
using System.Threading.Tasks;

namespace Triptales.Webapi.Services
{
    public class LocalFileService : IFileService
    {
        // Uploads are re-encoded as JPEG and capped at this many pixels on the longer
        // edge. Anything already within the limit keeps its original size - we only
        // ever shrink, never enlarge.
        private const int MaxDimension = 1600;
        private const int JpegQuality = 80;

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

            Image image;
            try
            {
                using var upload = file.OpenReadStream();
                image = await Image.LoadAsync(upload);
            }
            catch (ImageFormatException)
            {
                // Not an image we can decode - nothing is written.
                return false;
            }

            using (image)
            {
                if (image.Width > MaxDimension || image.Height > MaxDimension)
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Size = new Size(MaxDimension, MaxDimension),
                        Mode = ResizeMode.Max
                    }));

                using var stream = new FileStream(path, FileMode.Create);
                await image.SaveAsJpegAsync(stream, new JpegEncoder { Quality = JpegQuality });
            }
            return true;
        }
    }
}
