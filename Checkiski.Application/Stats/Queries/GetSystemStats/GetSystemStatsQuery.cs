using Checkiski.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Stats.Queries.GetSystemStats
{
    public class SystemStatsDto
    {
        public int TotalGames { get; set; }
        public int TotalPlayers { get; set; }
    }

    public class GetSystemStatsQuery : IRequest<SystemStatsDto>
    {
    }

    public class GetSystemStatsQueryHandler : IRequestHandler<GetSystemStatsQuery, SystemStatsDto>
    {
        private readonly IAppDbContext _context;

        public GetSystemStatsQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<SystemStatsDto> Handle(GetSystemStatsQuery request, CancellationToken cancellationToken)
        {
            return new SystemStatsDto
            {
                TotalGames = await _context.Games.CountAsync(cancellationToken),
                TotalPlayers = await _context.Players.CountAsync(cancellationToken)
            };
        }
    }
}
