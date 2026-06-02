using Checkiski.Domain.Entities;
using Checkiski.Application.Common.Helpers;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Infrastructure.Data
{
    public static class PuzzleSeeder
    {
        public static async Task SeedPuzzlesAsync(AppDbContext context, string stockfishPath)
        {
            if (context.Puzzles.Any()) return;

            var validator = new PuzzleValidator(stockfishPath);

            var candidates = new List<Puzzle>
            {
                new Puzzle
                {
                    Fen = "r1b2r1k/pp4pp/2p5/4N3/2B1n3/8/PPP2PPP/R3R1K1 w - - 0 1",
                    Solution = "e5g6",
                    Rating = 1500,
                    Themes = "anastasia"
                },
                new Puzzle
                {
                    Fen = "6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1",
                    Solution = "a1a8",
                    Rating = 1000,
                    Themes = "mateIn1, backRankMate"
                },
                new Puzzle
                {
                    Fen = "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5",
                    Solution = "f3e5", // Mock invalid logic
                    Rating = 1200,
                    Themes = "opening"
                },
                new Puzzle
                {
                    Fen = "1k1r4/pp3p1p/5p2/8/8/8/PP3PPP/2R3K1 w - - 0 1",
                    Solution = "c1c8", // Mock invalid logic
                    Rating = 1400,
                    Themes = "backRankMate"
                },
                new Puzzle
                {
                    Fen = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3", // Mock invalid
                    Solution = "g4h4",
                    Rating = 800,
                    Themes = "foolsMate"
                }
            };

            foreach (var p in candidates)
            {
                bool isValid = await validator.IsValidPuzzleAsync(p.Fen, p.Solution);
                if (isValid)
                {
                    context.Puzzles.Add(p);
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
