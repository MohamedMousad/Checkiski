using Checkiski.Application.Common.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Games.Commands.OfferDraw
{
    public class OfferDrawCommand : IRequest<bool>
    {
        public Guid GameId { get; set; }
        public Guid PlayerId { get; set; }
    }

    public class OfferDrawCommandHandler : IRequestHandler<OfferDrawCommand, bool>
    {
        private readonly IAppDbContext _context;
        private readonly IGameNotifier _notifier;

        public OfferDrawCommandHandler(IAppDbContext context, IGameNotifier notifier)
        {
            _context = context;
            _notifier = notifier;
        }

        public async Task<bool> Handle(OfferDrawCommand request, CancellationToken cancellationToken)
        {
            var game = await _context.Games.FindAsync(new object[] { request.GameId }, cancellationToken);
            if (game == null || game.Status != Checkiski.Domain.Entities.GameStatus.InProgress) return false;

            if (request.PlayerId != game.WhitePlayerId && request.PlayerId != game.BlackPlayerId)
                return false;

            if (game.DrawOfferedByPlayerId == null)
            {
                game.DrawOfferedByPlayerId = request.PlayerId;
                await _context.SaveChangesAsync(cancellationToken);
                return true;
            }
            else if (game.DrawOfferedByPlayerId != request.PlayerId)
            {
                game.Status = Checkiski.Domain.Entities.GameStatus.Draw;
                game.EndedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync(cancellationToken);

                await _notifier.GameEndedAsync(game.Id, game.Status);
                return true;
            }
            return false;
        }
    }
}
