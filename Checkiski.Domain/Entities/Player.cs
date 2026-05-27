using System;
using System.Collections.Generic;

namespace Checkiski.Domain.Entities
{
    public class Player
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int Rating { get; set; } = 1200; // Legacy or general rating
        public int BulletRating { get; set; } = 1200;
        public int BlitzRating { get; set; } = 1200;
        public int RapidRating { get; set; } = 1200;
        public int ClassicalRating { get; set; } = 1200;
        public string? ProfilePictureUrl { get; set; }
        public string? Bio { get; set; }
        public string? Country { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public List<Game> GamesAsWhite { get; set; } = new();
        public List<Game> GamesAsBlack { get; set; } = new();
    }
}
