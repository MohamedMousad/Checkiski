using Checkiski.Application.Common.Interfaces;
using Checkiski.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Games.Commands.CreateGame
{
    public class CreateGameCommand : IRequest<Guid>
    {
        public string HostUsername { get; set; } = string.Empty;
        public Checkiski.Domain.Entities.Color ColorChoice { get; set; } = Checkiski.Domain.Entities.Color.None;
        public bool Rated { get; set; } = true;
        public int BaseMinutes { get; set; } = 5;
        public int IncrementSeconds { get; set; } = 0;
        public Checkiski.Domain.Enums.GameCategory GameCategory { get; set; } = Checkiski.Domain.Enums.GameCategory.Blitz;
    }

    public class CreateGameCommandHandler : IRequestHandler<CreateGameCommand, Guid>
    {
        private readonly IAppDbContext _context;

        public CreateGameCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(CreateGameCommand request, CancellationToken cancellationToken)
        {
            var hostPlayer = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.FirstOrDefaultAsync(_context.Players, p => p.Username == request.HostUsername, cancellationToken);
            if (hostPlayer == null)
            {
                throw new Exception("Host player not found");
            }

            var existingWaitingGames = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(_context.Games.Where(
                g => (g.WhitePlayerId == hostPlayer.Id || g.BlackPlayerId == hostPlayer.Id) 
                  && g.Status == Checkiski.Domain.Entities.GameStatus.WaitingForOpponent), 
                cancellationToken);

            foreach (var waitingGame in existingWaitingGames)
            {
                waitingGame.Status = Checkiski.Domain.Entities.GameStatus.Aborted;
                waitingGame.EndedAt = DateTime.UtcNow;
            }

            var existingGame = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.FirstOrDefaultAsync(_context.Games, 
                g => (g.WhitePlayerId == hostPlayer.Id || g.BlackPlayerId == hostPlayer.Id) 
                  && g.Status == Checkiski.Domain.Entities.GameStatus.InProgress, 
                cancellationToken);

            if (existingGame != null)
            {
                return existingGame.Id;
            }
            
            var timeControl = new Checkiski.Domain.ValueObjects.TimeControl(request.BaseMinutes, request.IncrementSeconds);
            
            var colorChoice = request.ColorChoice;
            var rated = request.Rated;
            var gameCategory = request.GameCategory;
            
            if (colorChoice == Checkiski.Domain.Entities.Color.None)
            {
                colorChoice = (new Random().Next(2) == 0) ? Checkiski.Domain.Entities.Color.White : Checkiski.Domain.Entities.Color.Black;
            }
            
            var options = new Checkiski.Domain.ValueObjects.GameOptions(colorChoice, rated, timeControl, gameCategory);

            var game = new Game
            {
                Options = options,
                StartedAt = DateTime.UtcNow,
                Status = Checkiski.Domain.Entities.GameStatus.WaitingForOpponent,
                WhiteClockRemaining = TimeSpan.FromMinutes(request.BaseMinutes),
                BlackClockRemaining = TimeSpan.FromMinutes(request.BaseMinutes)
            };

            if (options.ColorChoice == Checkiski.Domain.Entities.Color.White)
            {
                game.WhitePlayer = hostPlayer;
                game.WhitePlayerId = hostPlayer.Id;
            }
            else
            {
                game.BlackPlayer = hostPlayer;
                game.BlackPlayerId = hostPlayer.Id;
            }

            _context.Games.Add(game);
            await _context.SaveChangesAsync(cancellationToken);

            return game.Id;
        }
    }
}
