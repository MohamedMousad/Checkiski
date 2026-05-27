using Checkiski.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Players.Commands.LoginPlayer
{
    public class LoginPlayerCommand : IRequest<AuthResponse>
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginPlayerCommandHandler : IRequestHandler<LoginPlayerCommand, AuthResponse>
    {
        private readonly IAppDbContext _context;
        private readonly IJwtService _jwtService;

        public LoginPlayerCommandHandler(IAppDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse> Handle(LoginPlayerCommand request, CancellationToken cancellationToken)
        {
            var player = await _context.Players.FirstOrDefaultAsync(p => p.Username == request.Username, cancellationToken);
            if (player == null || !BCrypt.Net.BCrypt.Verify(request.Password, player.PasswordHash))
                throw new Exception("Invalid credentials.");

            var token = _jwtService.GenerateToken(player.Id, player.Username);
            return new AuthResponse { Token = token, Username = player.Username, PlayerId = player.Id.ToString() };
        }
    }
}
