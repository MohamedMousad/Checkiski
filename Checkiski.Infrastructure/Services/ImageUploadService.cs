using Checkiski.Application.Common.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Infrastructure.Services
{
    public class ImageUploadService : IImageUploadService
    {
        private readonly Cloudinary _cloudinary;

        public ImageUploadService(IConfiguration configuration)
        {
            var account = new Account(
                configuration["Cloudinary:CloudName"],
                configuration["Cloudinary:ApiKey"],
                configuration["Cloudinary:ApiSecret"]
            );
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadImageAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default)
        {
            if (fileStream == null || fileStream.Length == 0)
                return null;

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(fileName, fileStream),
                Folder = "checkiski_profiles",
                Transformation = new Transformation().Height(500).Width(500).Crop("fill")
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams, cancellationToken);

            return uploadResult.SecureUrl?.ToString();
        }
    }
}
