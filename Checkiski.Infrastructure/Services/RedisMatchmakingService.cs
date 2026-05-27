using Checkiski.Application.Common.Interfaces;
using Checkiski.Domain.Entities;
using Checkiski.Domain.Enums;
using Checkiski.Application.Games.Commands.CreateGame;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Infrastructure.Services
{
    public class RedisMatchmakingService : IMatchmakingService
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IServiceScopeFactory _scopeFactory;

        public RedisMatchmakingService(IConnectionMultiplexer redis, IServiceScopeFactory scopeFactory)
        {
            _redis = redis;
            _scopeFactory = scopeFactory;
        }

        public async Task JoinQueueAsync(Guid playerId, GameCategory category, int elo)
        {
            var db = _redis.GetDatabase();
            var queueKey = $"matchmaking:queue:{category}";
            var playerKey = playerId.ToString();

            // Add player to ZSET with their elo as the score
            await db.SortedSetAddAsync(queueKey, playerKey, elo);

            // Attempt to find a match (radius of +/- 50 elo)
            var minElo = elo - 50;
            var maxElo = elo + 50;
            
            var potentialMatches = await db.SortedSetRangeByScoreAsync(queueKey, minElo, maxElo);
            var matchId = potentialMatches.FirstOrDefault(p => p != playerKey);

            if (matchId.HasValue)
            {
                var matchedPlayerId = Guid.Parse(matchId.ToString());

                // Remove both players from the queue
                var transaction = db.CreateTransaction();
                _ = transaction.SortedSetRemoveAsync(queueKey, playerKey);
                _ = transaction.SortedSetRemoveAsync(queueKey, matchId);
                var success = await transaction.ExecuteAsync();

                if (success)
                {
                    // Trigger game creation via MediatR
                    using var scope = _scopeFactory.CreateScope();
                    var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();

                    // Create the game (Randomize white/black)
                    var whitePlayer = new Random().Next(2) == 0 ? playerId : matchedPlayerId;
                    var blackPlayer = whitePlayer == playerId ? matchedPlayerId : playerId;
                    var command = new MatchmakeGameCommand
                    {
                        WhitePlayerId = whitePlayer,
                        BlackPlayerId = blackPlayer,
                        Category = category
                    };
                    
                    var gameId = await mediator.Send(command);

                    // Notify clients
                    var notifier = scope.ServiceProvider.GetRequiredService<IGameNotifier>();
                    await notifier.MatchFoundAsync(playerId, matchedPlayerId, gameId);
                }
            }
        }

        public async Task LeaveQueueAsync(Guid playerId, GameCategory category)
        {
            var db = _redis.GetDatabase();
            var queueKey = $"matchmaking:queue:{category}";
            await db.SortedSetRemoveAsync(queueKey, playerId.ToString());
        }
    }
}
