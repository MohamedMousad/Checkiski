using Checkiski.Application.Common.Interfaces;
using Checkiski.Domain.Entities;
using Checkiski.Domain.Enums;
using Checkiski.Application.Games.Commands.CreateGame;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Infrastructure.Services
{
    public class InMemoryMatchmakingService : IMatchmakingService
    {
        // Simple in-memory queue: Category -> ConcurrentDictionary<PlayerId, Elo>
        private static readonly ConcurrentDictionary<GameCategory, ConcurrentDictionary<Guid, int>> _queues = new();
        private readonly IServiceScopeFactory _scopeFactory;

        public InMemoryMatchmakingService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public async Task JoinQueueAsync(Guid playerId, GameCategory category, int elo)
        {
            var queue = _queues.GetOrAdd(category, _ => new ConcurrentDictionary<Guid, int>());
            queue.TryAdd(playerId, elo);

            var minElo = elo - 50;
            var maxElo = elo + 50;

            // Find a match
            var potentialMatch = queue.FirstOrDefault(p => p.Key != playerId && p.Value >= minElo && p.Value <= maxElo);
            
            if (potentialMatch.Key != Guid.Empty)
            {
                // Remove both from queue
                queue.TryRemove(playerId, out _);
                queue.TryRemove(potentialMatch.Key, out _);

                // Trigger game creation
                using var scope = _scopeFactory.CreateScope();
                var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();

                var whitePlayer = new Random().Next(2) == 0 ? playerId : potentialMatch.Key;
                var blackPlayer = whitePlayer == playerId ? potentialMatch.Key : playerId;
                
                var command = new MatchmakeGameCommand
                {
                    WhitePlayerId = whitePlayer,
                    BlackPlayerId = blackPlayer,
                    Category = category
                };
                
                var gameId = await mediator.Send(command);

                var notifier = scope.ServiceProvider.GetRequiredService<IGameNotifier>();
                await notifier.MatchFoundAsync(playerId, potentialMatch.Key, gameId);
            }
        }

        public Task LeaveQueueAsync(Guid playerId, GameCategory category)
        {
            if (_queues.TryGetValue(category, out var queue))
            {
                queue.TryRemove(playerId, out _);
            }
            return Task.CompletedTask;
        }
    }
}
