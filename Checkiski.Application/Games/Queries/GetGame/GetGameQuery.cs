using Checkiski.Application.Common.Interfaces;
using Checkiski.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Games.Queries.GetGame
{
    public class GameDto
    {
        public Guid Id { get; set; }
        public string Pgn { get; set; } = string.Empty;
        public string CurrentFen { get; set; } = string.Empty;
        public TimeSpan WhiteClockRemaining { get; set; }
        public TimeSpan BlackClockRemaining { get; set; }
        public string Status { get; set; } = string.Empty;
        public Guid? WhitePlayerId { get; set; }
        public Guid? BlackPlayerId { get; set; }
    }

    public class GetGameQuery : IRequest<GameDto?>
    {
        public Guid GameId { get; set; }
    }

    public class GetGameQueryHandler : IRequestHandler<GetGameQuery, GameDto?>
    {
        private readonly IAppDbContext _context;

        public GetGameQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<GameDto?> Handle(GetGameQuery request, CancellationToken cancellationToken)
        {
            var game = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.FirstOrDefaultAsync(_context.Games, g => g.Id == request.GameId, cancellationToken);
            if (game == null) return null;
            
            return new GameDto
            {
                Id = game.Id,
                Pgn = game.Pgn,
                CurrentFen = game.CurrentFen,
                WhiteClockRemaining = game.WhiteClockRemaining,
                BlackClockRemaining = game.BlackClockRemaining,
                Status = game.Status.ToString(),
                WhitePlayerId = game.WhitePlayerId,
                BlackPlayerId = game.BlackPlayerId
            };
        }
    }
}
