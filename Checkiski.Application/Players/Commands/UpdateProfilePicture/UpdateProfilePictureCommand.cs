using Checkiski.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Players.Commands.UpdateProfilePicture
{
    public class UpdateProfilePictureCommand : IRequest<bool>
    {
        public string PlayerId { get; set; }
        public string ProfilePictureUrl { get; set; }
    }

    public class UpdateProfilePictureCommandHandler : IRequestHandler<UpdateProfilePictureCommand, bool>
    {
        private readonly IAppDbContext _context;

        public UpdateProfilePictureCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdateProfilePictureCommand request, CancellationToken cancellationToken)
        {
            if (!System.Guid.TryParse(request.PlayerId, out var playerIdGuid)) return false;
            var player = await _context.Players.FirstOrDefaultAsync(p => p.Id == playerIdGuid, cancellationToken);
            if (player == null) return false;

            player.ProfilePictureUrl = request.ProfilePictureUrl;
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
