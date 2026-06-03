using Checkiski.Application.Common.Interfaces;
using Checkiski.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Games.Commands.JoinGame
{
    public class JoinGameCommand : IRequest<bool>
    {
        public Guid GameId { get; set; }
        public string Username { get; set; } = string.Empty;
    }

    public class JoinGameCommandHandler : IRequestHandler<JoinGameCommand, bool>
    {
        private readonly IAppDbContext _context;
        private readonly IGameNotifier _notifier;

        public JoinGameCommandHandler(IAppDbContext context, IGameNotifier notifier)
        {
            _context = context;
            _notifier = notifier;
        }

        public async Task<bool> Handle(JoinGameCommand request, CancellationToken cancellationToken)
        {
            var game = await _context.Games.FindAsync(new object[] { request.GameId }, cancellationToken);
            if (game == null) return false;
            
            if (game.WhitePlayerId != null && game.BlackPlayerId != null) return false; // Game is full

            var joinPlayer = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.FirstOrDefaultAsync(_context.Players, p => p.Username == request.Username, cancellationToken);
            if (joinPlayer == null)
            {
                joinPlayer = new Player { Username = request.Username };
                _context.Players.Add(joinPlayer);
            }

            if (game.WhitePlayerId == joinPlayer.Id || game.BlackPlayerId == joinPlayer.Id)
                return false; // Prevent self-join

            if (game.Status != Checkiski.Domain.Entities.GameStatus.WaitingForOpponent)
                return false;

            var existingWaitingGames = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(_context.Games.Where(
                g => (g.WhitePlayerId == joinPlayer.Id || g.BlackPlayerId == joinPlayer.Id) 
                  && g.Status == Checkiski.Domain.Entities.GameStatus.WaitingForOpponent
                  && g.Id != game.Id), 
                cancellationToken);

            foreach (var waitingGame in existingWaitingGames)
            {
                waitingGame.Status = Checkiski.Domain.Entities.GameStatus.Aborted;
                waitingGame.EndedAt = DateTime.UtcNow;
            }

            if (game.WhitePlayerId == null)
            {
                game.WhitePlayer = joinPlayer;
                game.WhitePlayerId = joinPlayer.Id;
            }
            else
            {
                game.BlackPlayer = joinPlayer;
                game.BlackPlayerId = joinPlayer.Id;
            }

            if (game.WhitePlayerId != null && game.BlackPlayerId != null)
            {
                game.Status = Checkiski.Domain.Entities.GameStatus.InProgress;
                game.StartedAt = DateTime.UtcNow;
                game.LastMoveAt = DateTime.UtcNow;
            }
            
            await _context.SaveChangesAsync(cancellationToken);
            
            if (game.Status == Checkiski.Domain.Entities.GameStatus.InProgress)
            {
                await _notifier.PlayerJoinedAsync(game.Id);
            }
            return true;
        }
    }
}
