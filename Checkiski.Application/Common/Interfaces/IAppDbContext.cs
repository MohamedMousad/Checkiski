using Checkiski.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Common.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<Game> Games { get; }
        DbSet<Player> Players { get; }
        DbSet<Puzzle> Puzzles { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
