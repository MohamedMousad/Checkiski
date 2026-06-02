using Checkiski.Application.Common.Interfaces;
using Checkiski.Domain.Entities;
using Checkiski.Hubs;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Checkiski.WebApi.Services
{
    public class GameNotifier : IGameNotifier
    {
        private readonly IHubContext<GameHub> _hubContext;

        public GameNotifier(IHubContext<GameHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task MoveSubmittedAsync(Guid gameId, string fen, string pgn, TimeSpan whiteClock, TimeSpan blackClock)
        {
            await _hubContext.Clients.Group(gameId.ToString()).SendAsync("ReceiveMove", new
            {
                Fen = fen,
                Pgn = pgn,
                WhiteClock = whiteClock.TotalSeconds,
                BlackClock = blackClock.TotalSeconds
            });
        }

        public async Task GameEndedAsync(Guid gameId, GameStatus status)
        {
            await _hubContext.Clients.Group(gameId.ToString()).SendAsync("GameEnded", new { Status = status.ToString() });
        }

        public async Task MatchFoundAsync(System.Guid player1Id, System.Guid player2Id, System.Guid gameId)
        {
            // In a real app we'd map PlayerIds to connection IDs. 
            // For now, broadcast to a player-specific group if they joined it, or just broadcast to everyone and let clients filter.
            await _hubContext.Clients.Group(player1Id.ToString()).SendAsync("MatchFound", gameId);
            await _hubContext.Clients.Group(player2Id.ToString()).SendAsync("MatchFound", gameId);
        }

        public async Task PlayerJoinedAsync(Guid gameId)
        {
            await _hubContext.Clients.Group(gameId.ToString()).SendAsync("PlayerJoined");
        }

        public async Task DrawOfferedAsync(Guid gameId, Guid offeredByPlayerId)
        {
            await _hubContext.Clients.Group(gameId.ToString()).SendAsync("DrawOffered", offeredByPlayerId.ToString());
        }
    }
}
