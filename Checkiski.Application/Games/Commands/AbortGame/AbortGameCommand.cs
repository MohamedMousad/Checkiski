using Checkiski.Application.Common.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Games.Commands.AbortGame
{
    public class AbortGameCommand : IRequest<bool>
    {
        public Guid GameId { get; set; }
        public Guid PlayerId { get; set; }
    }

    public class AbortGameCommandHandler : IRequestHandler<AbortGameCommand, bool>
    {
        private readonly IAppDbContext _context;
        private readonly IGameNotifier _notifier;

        public AbortGameCommandHandler(IAppDbContext context, IGameNotifier notifier)
        {
            _context = context;
            _notifier = notifier;
        }

        public async Task<bool> Handle(AbortGameCommand request, CancellationToken cancellationToken)
        {
            var game = await _context.Games.FindAsync(new object[] { request.GameId }, cancellationToken);
            if (game == null || game.Status != Checkiski.Domain.Entities.GameStatus.InProgress) return false;

            if (request.PlayerId != game.WhitePlayerId && request.PlayerId != game.BlackPlayerId)
                return false;

            // Abort is only allowed if no moves have been made yet
            if (game.MoveList.Count > 0)
                return false;

            game.Status = Checkiski.Domain.Entities.GameStatus.Aborted;
            game.EndedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            await _notifier.GameEndedAsync(game.Id, game.Status);

            return true;
        }
    }
}
