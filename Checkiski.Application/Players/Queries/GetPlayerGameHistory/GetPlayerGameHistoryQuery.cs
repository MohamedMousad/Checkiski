using Checkiski.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Players.Queries.GetPlayerGameHistory
{
    public class GameHistoryDto
    {
        public Guid GameId { get; set; }
        public string OpponentName { get; set; } = string.Empty;
        public string GameCategory { get; set; } = string.Empty;
        public DateTime PlayedAt { get; set; }
        public string Outcome { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
    }

    public class GetPlayerGameHistoryQuery : IRequest<List<GameHistoryDto>>
    {
        public Guid PlayerId { get; set; }
    }

    public class GetPlayerGameHistoryQueryHandler : IRequestHandler<GetPlayerGameHistoryQuery, List<GameHistoryDto>>
    {
        private readonly IAppDbContext _context;

        public GetPlayerGameHistoryQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<List<GameHistoryDto>> Handle(GetPlayerGameHistoryQuery request, CancellationToken cancellationToken)
        {
            var games = await _context.Games
                .Include(g => g.WhitePlayer)
                .Include(g => g.BlackPlayer)
                .Where(g => g.WhitePlayerId == request.PlayerId || g.BlackPlayerId == request.PlayerId)
                .Where(g => g.Status != Domain.Entities.GameStatus.InProgress && g.Status != Domain.Entities.GameStatus.WaitingForOpponent)
                .OrderByDescending(g => g.StartedAt)
                .ToListAsync(cancellationToken);

            var result = new List<GameHistoryDto>();

            foreach (var g in games)
            {
                bool isWhite = g.WhitePlayerId == request.PlayerId;
                string opponentName = isWhite ? (g.BlackPlayer?.Username ?? "Unknown") : (g.WhitePlayer?.Username ?? "Unknown");
                string outcome = "Draw";
                
                if (g.Status == Domain.Entities.GameStatus.WhiteWon)
                {
                    outcome = isWhite ? "Win" : "Loss";
                }
                else if (g.Status == Domain.Entities.GameStatus.BlackWon)
                {
                    outcome = isWhite ? "Loss" : "Win";
                }

                result.Add(new GameHistoryDto
                {
                    GameId = g.Id,
                    OpponentName = opponentName,
                    GameCategory = g.Options?.GameCategory ?? "Standard",
                    PlayedAt = g.EndedAt ?? g.StartedAt,
                    Outcome = outcome,
                    Color = isWhite ? "White" : "Black"
                });
            }

            return result;
        }
    }
}
