using Checkiski.Application.Common.Interfaces;
using Checkiski.Domain.Entities;
using Checkiski.Domain.Enums;
using Checkiski.Domain.ValueObjects;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Games.Commands.CreateGame
{
    public class MatchmakeGameCommand : IRequest<Guid>
    {
        public Guid WhitePlayerId { get; set; }
        public Guid BlackPlayerId { get; set; }
        public GameCategory Category { get; set; }
    }

    public class MatchmakeGameCommandHandler : IRequestHandler<MatchmakeGameCommand, Guid>
    {
        private readonly IAppDbContext _context;

        public MatchmakeGameCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(MatchmakeGameCommand request, CancellationToken cancellationToken)
        {
            var white = await _context.Players.FindAsync(new object[] { request.WhitePlayerId }, cancellationToken);
            var black = await _context.Players.FindAsync(new object[] { request.BlackPlayerId }, cancellationToken);

            var options = new GameOptions
            {
                GameCategory = request.Category,
                Rated = true,
                ColorChoice = Color.White,
                TimeControl = request.Category switch
                {
                    GameCategory.Bullet => new TimeControl(1, 0),
                    GameCategory.Blitz => new TimeControl(3, 0),
                    GameCategory.Rapid => new TimeControl(10, 0),
                    GameCategory.Classical => new TimeControl(30, 0),
                    _ => new TimeControl(10, 0)
                }
            };

            var game = new Game
            {
                Options = options,
                StartedAt = DateTime.UtcNow,
                Status = GameStatus.InProgress,
                WhitePlayer = white,
                WhitePlayerId = request.WhitePlayerId,
                BlackPlayer = black,
                BlackPlayerId = request.BlackPlayerId,
                WhiteClockRemaining = TimeSpan.FromMinutes(options.TimeControl.BaseMinutes),
                BlackClockRemaining = TimeSpan.FromMinutes(options.TimeControl.BaseMinutes)
            };

            _context.Games.Add(game);
            await _context.SaveChangesAsync(cancellationToken);

            return game.Id;
        }
    }
}
