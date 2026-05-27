using Checkiski.Application.Common.Interfaces;
using Checkiski.Application.Players.Commands.LoginPlayer;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Players.Commands.UpdateProfile
{
    public class UpdateProfileCommand : IRequest<AuthResponse>
    {
        [System.Text.Json.Serialization.JsonIgnore]
        public Guid PlayerId { get; set; }
        
        public string? Username { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public string? Bio { get; set; }
        public string? Country { get; set; }
    }

    public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, AuthResponse>
    {
        private readonly IAppDbContext _context;
        private readonly IJwtService _jwtService;

        public UpdateProfileCommandHandler(IAppDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        {
            var player = await _context.Players.FirstOrDefaultAsync(p => p.Id == request.PlayerId, cancellationToken);
            if (player == null)
            {
                throw new Exception("Player not found");
            }

            bool usernameChanged = false;
            if (!string.IsNullOrEmpty(request.Username) && request.Username != player.Username)
            {
                var existingUser = await _context.Players.FirstOrDefaultAsync(p => p.Username == request.Username, cancellationToken);
                if (existingUser != null)
                {
                    throw new Exception("Username is already taken");
                }
                player.Username = request.Username;
                usernameChanged = true;
            }

            if (request.ProfilePictureUrl != null)
            {
                player.ProfilePictureUrl = request.ProfilePictureUrl;
            }
            if (request.Bio != null)
            {
                player.Bio = request.Bio;
            }
            if (request.Country != null)
            {
                player.Country = request.Country;
            }

            await _context.SaveChangesAsync(cancellationToken);

            string token = "";
            if (usernameChanged)
            {
                token = _jwtService.GenerateToken(player.Id, player.Username);
            }

            return new AuthResponse { Token = token, Username = player.Username, PlayerId = player.Id.ToString() };
        }
    }
}
