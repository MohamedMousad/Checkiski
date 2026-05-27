using Checkiski.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Checkiski.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PuzzleController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetPuzzles([FromQuery] int rating = 1200)
        {
            // For now, mock a few puzzles.
            // In a real app we'd query Lichess API or a database.
            var puzzles = new List<Puzzle>
            {
                new Puzzle
                {
                    Fen = "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5",
                    Solution = "f3e5 c6e5 d2d4",
                    Rating = 1200,
                    Themes = "fork, opening"
                },
                new Puzzle
                {
                    Fen = "1k1r4/pp3p1p/5p2/8/8/8/PP3PPP/2R3K1 w - - 0 1",
                    Solution = "c1c8 d8c8",
                    Rating = 1400,
                    Themes = "backRankMate"
                },
                new Puzzle
                {
                    Fen = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3",
                    Solution = "g4h4", // Just mock solutions
                    Rating = 800,
                    Themes = "foolsMate"
                }
            };

            return Ok(puzzles);
        }
    }
}
