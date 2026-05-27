using Checkiski.Application.Common.Interfaces;
using Checkiski.Domain.Entities;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Checkiski.Application.Games.Queries.ListGames
{
    public class ListGamesQuery : IRequest<List<Checkiski.Application.Games.Queries.GetGame.GameDto>>
    {
    }

    public class ListGamesQueryHandler : IRequestHandler<ListGamesQuery, List<Checkiski.Application.Games.Queries.GetGame.GameDto>>
    {
        private readonly IAppDbContext _context;

        public ListGamesQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Checkiski.Application.Games.Queries.GetGame.GameDto>> Handle(ListGamesQuery request, CancellationToken cancellationToken)
        {
            var games = await _context.Games.ToListAsync(cancellationToken);
            return games.Select(game => new Checkiski.Application.Games.Queries.GetGame.GameDto
            {
                Id = game.Id,
                Pgn = game.Pgn,
                CurrentFen = game.CurrentFen,
                WhiteClockRemaining = game.WhiteClockRemaining,
                BlackClockRemaining = game.BlackClockRemaining,
                Status = game.Status.ToString(),
                WhitePlayerId = game.WhitePlayerId,
                BlackPlayerId = game.BlackPlayerId
            }).ToList();
        }
    }
}
