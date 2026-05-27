using Checkiski.Application.Common.Interfaces;
using Checkiski.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Players.Queries.GetPlayerProfile
{
    public class GetPlayerProfileQuery : IRequest<Player?>
    {
        public Guid PlayerId { get; set; }
    }

    public class GetPlayerProfileQueryHandler : IRequestHandler<GetPlayerProfileQuery, Player?>
    {
        private readonly IAppDbContext _context;

        public GetPlayerProfileQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<Player?> Handle(GetPlayerProfileQuery request, CancellationToken cancellationToken)
        {
            return await _context.Players.FindAsync(new object[] { request.PlayerId }, cancellationToken);
        }
    }
}
