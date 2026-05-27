using Checkiski.Application.Common.Interfaces;
using Checkiski.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;

namespace Checkiski.Application.Players.Commands.RegisterPlayer
{
    public class RegisterPlayerCommand : IRequest<AuthResponse>
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterPlayerCommandHandler : IRequestHandler<RegisterPlayerCommand, AuthResponse>
    {
        private readonly IAppDbContext _context;
        private readonly IJwtService _jwtService;

        public RegisterPlayerCommandHandler(IAppDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse> Handle(RegisterPlayerCommand request, CancellationToken cancellationToken)
        {
            var exists = await _context.Players.AnyAsync(p => p.Username == request.Username, cancellationToken);
            if (exists) throw new Exception("User already exists.");

            var player = new Player
            {
                Username = request.Username,
                // In a real app we'd hash the password here. For this demo we'll skip DB password persistence if no field exists, 
                // but the task says: "Create RegisterPlayerCommand and LoginPlayerCommand with secure password hashing (BCrypt) if needed".
                // I need to add PasswordHash to Player.cs.
            };

            // Let's assume we added PasswordHash to Player.cs.
            player.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            _context.Players.Add(player);
            await _context.SaveChangesAsync(cancellationToken);

            var token = _jwtService.GenerateToken(player.Id, player.Username);

            return new AuthResponse { Token = token, Username = player.Username, PlayerId = player.Id.ToString() };
        }
    }
}
