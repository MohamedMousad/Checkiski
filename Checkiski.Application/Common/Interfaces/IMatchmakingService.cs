using Checkiski.Domain.Entities;
using Checkiski.Domain.Enums;
using System;
using System.Threading.Tasks;

namespace Checkiski.Application.Common.Interfaces
{
    public interface IMatchmakingService
    {
        Task JoinQueueAsync(Guid playerId, GameCategory category, int elo);
        Task LeaveQueueAsync(Guid playerId, GameCategory category);
    }
}
