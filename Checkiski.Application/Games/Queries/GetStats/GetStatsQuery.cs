using Checkiski.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Games.Queries.GetStats
{
    public class StatsDto
    {
        public int TotalMatchesPlayed { get; set; }
        public int TotalActivePlayers { get; set; }
        public int TotalCheckmates { get; set; }
    }

    public class GetStatsQuery : IRequest<StatsDto>
    {
    }

    public class GetStatsQueryHandler : IRequestHandler<GetStatsQuery, StatsDto>
    {
        private readonly IAppDbContext _context;

        public GetStatsQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<StatsDto> Handle(GetStatsQuery request, CancellationToken cancellationToken)
        {
            var totalMatches = await _context.Games.CountAsync(g => g.Status != Domain.Entities.GameStatus.WaitingForOpponent, cancellationToken);
            var activePlayers = await _context.Players.CountAsync(cancellationToken);
            // We can approximate checkmates by WhiteWon + BlackWon, or just total matches for now
            var checkmates = await _context.Games.CountAsync(g => g.Status == Domain.Entities.GameStatus.WhiteWon || g.Status == Domain.Entities.GameStatus.BlackWon, cancellationToken);

            return new StatsDto
            {
                TotalMatchesPlayed = totalMatches,
                TotalActivePlayers = activePlayers,
                TotalCheckmates = checkmates
            };
        }
    }
}
