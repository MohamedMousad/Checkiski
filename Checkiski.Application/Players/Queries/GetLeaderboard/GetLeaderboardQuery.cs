using Checkiski.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System;

namespace Checkiski.Application.Players.Queries.GetLeaderboard
{
    public class LeaderboardPlayerDto 
    {
        public Guid Id { get; set; }
        public string? Username { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public string? Bio { get; set; }
        public string? Country { get; set; }
        public int Rating { get; set; }
        public int BulletRating { get; set; }
        public int BlitzRating { get; set; }
        public int RapidRating { get; set; }
        public int ClassicalRating { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class GetLeaderboardQuery : IRequest<List<LeaderboardPlayerDto>>
    {
        public string? Category { get; set; }
    }

    public class GetLeaderboardQueryHandler : IRequestHandler<GetLeaderboardQuery, List<LeaderboardPlayerDto>>
    {
        private readonly IAppDbContext _context;

        public GetLeaderboardQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<List<LeaderboardPlayerDto>> Handle(GetLeaderboardQuery request, CancellationToken cancellationToken)
        {
            IQueryable<Domain.Entities.Player> query = _context.Players;
            
            if (request.Category?.ToLower() == "bullet")
            {
                query = query.OrderByDescending(p => p.BulletRating);
            }
            else if (request.Category?.ToLower() == "blitz")
            {
                query = query.OrderByDescending(p => p.BlitzRating);
            }
            else if (request.Category?.ToLower() == "rapid")
            {
                query = query.OrderByDescending(p => p.RapidRating);
            }
            else 
            {
                query = query.OrderByDescending(p => p.Rating);
            }

            var players = await query.Take(50).ToListAsync(cancellationToken);

            return players.Select(p => new LeaderboardPlayerDto
            {
                Id = p.Id,
                Username = p.Username,
                ProfilePictureUrl = p.ProfilePictureUrl,
                Bio = p.Bio,
                Country = p.Country,
                Rating = p.Rating,
                BulletRating = p.BulletRating,
                BlitzRating = p.BlitzRating,
                RapidRating = p.RapidRating,
                ClassicalRating = p.ClassicalRating,
                CreatedAt = p.CreatedAt
            }).ToList();
        }
    }
}
