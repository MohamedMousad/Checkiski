using Checkiski.Application.Common.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Games.Commands.ResignGame
{
    public class ResignGameCommand : IRequest<bool>
    {
        public Guid GameId { get; set; }
        public Guid PlayerId { get; set; }
    }

    public class ResignGameCommandHandler : IRequestHandler<ResignGameCommand, bool>
    {
        private readonly IAppDbContext _context;
        private readonly IGameNotifier _notifier;

        public ResignGameCommandHandler(IAppDbContext context, IGameNotifier notifier)
        {
            _context = context;
            _notifier = notifier;
        }

        public async Task<bool> Handle(ResignGameCommand request, CancellationToken cancellationToken)
        {
            var game = await _context.Games.FindAsync(new object[] { request.GameId }, cancellationToken);
            if (game == null || game.Status != Checkiski.Domain.Entities.GameStatus.InProgress) return false;

            if (request.PlayerId == game.WhitePlayerId)
                game.Status = Checkiski.Domain.Entities.GameStatus.BlackWon;
            else if (request.PlayerId == game.BlackPlayerId)
                game.Status = Checkiski.Domain.Entities.GameStatus.WhiteWon;
            else
                return false;

            game.EndedAt = DateTime.UtcNow;
            
            await Checkiski.Application.Common.Helpers.GameFinalizer.FinalizeGameAsync(_context, game, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            await _notifier.GameEndedAsync(game.Id, game.Status, game.WhiteClockRemaining, game.BlackClockRemaining);

            return true;
        }
    }
}
