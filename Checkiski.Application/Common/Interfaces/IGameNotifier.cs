using System;
using System.Threading.Tasks;
using Checkiski.Domain.Entities;

namespace Checkiski.Application.Common.Interfaces;

public interface IGameNotifier
{
    Task MoveSubmittedAsync(Guid gameId, string fen, string pgn, TimeSpan whiteClock, TimeSpan blackClock);
    Task GameEndedAsync(Guid gameId, GameStatus status);
    Task MatchFoundAsync(Guid player1Id, Guid player2Id, Guid gameId);
    Task PlayerJoinedAsync(Guid gameId);
    Task DrawOfferedAsync(Guid gameId, Guid offeredByPlayerId);
}
