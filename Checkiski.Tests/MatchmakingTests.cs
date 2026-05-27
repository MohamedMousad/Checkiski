using Checkiski.Domain.Entities;
using Checkiski.Domain.Enums;
using Checkiski.Application.Games.Commands.CreateGame;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using StackExchange.Redis;
using System;
using System.Threading.Tasks;
using Xunit;

namespace Checkiski.Tests
{
    public class MatchmakingTests
    {
        [Fact]
        public async Task JoinQueue_FindsMatchAndCreatesGame()
        {
            // Simple mock structure
            var mockRedis = new Mock<IConnectionMultiplexer>();
            var mockDb = new Mock<IDatabase>();
            mockRedis.Setup(r => r.GetDatabase(It.IsAny<int>(), It.IsAny<object>())).Returns(mockDb.Object);

            var p1 = Guid.NewGuid();
            var p2 = Guid.NewGuid();
            
            // Mock ZRangeByScore to return a match
            mockDb.Setup(db => db.SortedSetRangeByScoreAsync(It.IsAny<RedisKey>(), It.IsAny<double>(), It.IsAny<double>(), It.IsAny<Exclude>(), It.IsAny<Order>(), It.IsAny<long>(), It.IsAny<long>(), It.IsAny<CommandFlags>()))
                  .ReturnsAsync(new RedisValue[] { p2.ToString() });

            var mockTransaction = new Mock<ITransaction>();
            mockDb.Setup(db => db.CreateTransaction(It.IsAny<object>())).Returns(mockTransaction.Object);
            mockTransaction.Setup(t => t.ExecuteAsync(It.IsAny<CommandFlags>())).ReturnsAsync(true);

            var mockScopeFactory = new Mock<IServiceScopeFactory>();
            var mockScope = new Mock<IServiceScope>();
            var mockProvider = new Mock<IServiceProvider>();

            var mockMediator = new Mock<IMediator>();
            mockMediator.Setup(m => m.Send(It.IsAny<MatchmakeGameCommand>(), default)).ReturnsAsync(Guid.NewGuid());

            var mockNotifier = new Mock<Checkiski.Application.Common.Interfaces.IGameNotifier>();

            mockProvider.Setup(p => p.GetService(typeof(IMediator))).Returns(mockMediator.Object);
            mockProvider.Setup(p => p.GetService(typeof(Checkiski.Application.Common.Interfaces.IGameNotifier))).Returns(mockNotifier.Object);
            mockScope.Setup(s => s.ServiceProvider).Returns(mockProvider.Object);
            mockScopeFactory.Setup(f => f.CreateScope()).Returns(mockScope.Object);

            var service = new Checkiski.Infrastructure.Services.RedisMatchmakingService(mockRedis.Object, mockScopeFactory.Object);

            await service.JoinQueueAsync(p1, GameCategory.Blitz, 1200);

            // Verify a match was found and game created
            mockMediator.Verify(m => m.Send(It.IsAny<MatchmakeGameCommand>(), default), Times.Once);
            mockNotifier.Verify(n => n.MatchFoundAsync(p1, p2, It.IsAny<Guid>()), Times.Once);
        }
    }
}
