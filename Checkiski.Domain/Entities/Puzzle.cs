using System;

namespace Checkiski.Domain.Entities
{
    public class Puzzle
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Fen { get; set; } = string.Empty;
        public string Solution { get; set; } = string.Empty; // e.g. "e2e4, e7e5"
        public int Rating { get; set; }
        public string Themes { get; set; } = string.Empty;
    }
}
