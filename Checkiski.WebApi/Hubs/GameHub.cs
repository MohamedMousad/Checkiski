using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Checkiski.Hubs
{
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class GameHub : Hub
    {
        private readonly MediatR.IMediator _mediator;

        public GameHub(MediatR.IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task JoinGameGroup(string gameId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
        }

        public async Task LeaveGameGroup(string gameId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);
        }

        public async Task PlayerReady(string gameId, bool isReply)
        {
            await Clients.OthersInGroup(gameId).SendAsync("OpponentReady", isReply);
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            }
            await base.OnConnectedAsync();
        }

        public async Task JoinQueue(int categoryId, int elo)
        {
            var userId = Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return;

            var matchmakingService = Context.GetHttpContext()?.RequestServices.GetService(typeof(Checkiski.Application.Common.Interfaces.IMatchmakingService)) as Checkiski.Application.Common.Interfaces.IMatchmakingService;
            if (matchmakingService != null)
            {
                await matchmakingService.JoinQueueAsync(System.Guid.Parse(userId), (Checkiski.Domain.Enums.GameCategory)categoryId, elo);
            }
        }

        public async Task LeaveQueue(int categoryId)
        {
            var userId = Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return;

            var matchmakingService = Context.GetHttpContext()?.RequestServices.GetService(typeof(Checkiski.Application.Common.Interfaces.IMatchmakingService)) as Checkiski.Application.Common.Interfaces.IMatchmakingService;
            if (matchmakingService != null)
            {
                await matchmakingService.LeaveQueueAsync(System.Guid.Parse(userId), (Checkiski.Domain.Enums.GameCategory)categoryId);
            }
        }

        public async Task SendMessage(string gameId, string username, string message)
        {
            await Clients.Group(gameId).SendAsync("ReceiveMessage", username, message);
        }

        public async Task SubmitMove(Checkiski.Application.Games.Commands.SubmitMove.SubmitMoveCommand command)
        {
            var success = await _mediator.Send(command);
            if (!success)
            {
                await Clients.Caller.SendAsync("MoveFailed", "Invalid move.");
            }
        }
    }
}
