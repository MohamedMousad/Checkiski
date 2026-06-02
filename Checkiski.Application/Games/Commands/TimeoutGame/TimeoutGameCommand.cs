using Checkiski.Application.Common.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Games.Commands.TimeoutGame
{
    public class TimeoutGameCommand : IRequest<bool>
    {
        public Guid GameId { get; set; }
        public Guid PlayerId { get; set; }
    }

    public class TimeoutGameCommandHandler : IRequestHandler<TimeoutGameCommand, bool>
    {
        private readonly IAppDbContext _context;
        private readonly IGameNotifier _notifier;

        public TimeoutGameCommandHandler(IAppDbContext context, IGameNotifier notifier)
        {
            _context = context;
            _notifier = notifier;
        }

        public async Task<bool> Handle(TimeoutGameCommand request, CancellationToken cancellationToken)
        {
            var game = await _context.Games.FindAsync(new object[] { request.GameId }, cancellationToken);
            if (game == null || game.Status != Checkiski.Domain.Entities.GameStatus.InProgress) return false;

            if (game.CurrentTurn == Checkiski.Domain.Entities.Color.White)
            {
                game.Status = Checkiski.Domain.Entities.GameStatus.BlackWon;
                game.WhiteClockRemaining = TimeSpan.Zero;
            }
            else
            {
                game.Status = Checkiski.Domain.Entities.GameStatus.WhiteWon;
                game.BlackClockRemaining = TimeSpan.Zero;
            }

            game.EndedAt = DateTime.UtcNow;
            
            await Checkiski.Application.Common.Helpers.GameFinalizer.FinalizeGameAsync(_context, game, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            // We can send the actual GameStatus, but the frontend intercepts locally to say "Finished by Timeout"
            await _notifier.GameEndedAsync(game.Id, game.Status, game.WhiteClockRemaining, game.BlackClockRemaining);

            return true;
        }
    }
}
