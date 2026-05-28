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
            var players = await _context.Players
                .OrderByDescending(p => p.Rating)
                .Take(50)
                .ToListAsync(cancellationToken);

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
