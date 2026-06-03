using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Common.Interfaces
{
    public interface IImageUploadService
    {
        Task<string> UploadImageAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default);
    }
}
