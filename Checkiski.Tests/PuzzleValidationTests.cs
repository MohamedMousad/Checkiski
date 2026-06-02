using System.Threading.Tasks;
using Xunit;
using Checkiski.Application.Common.Helpers;

namespace Checkiski.Tests
{
    public class PuzzleValidationTests
    {
        private readonly PuzzleValidator _validator;

        public PuzzleValidationTests()
        {
            // Pointing to where stockfish was downloaded during runtime. 
            // Depending on the test runner directory, we might need a full path, but for now we assume it's in the bin or WebApi.
            _validator = new PuzzleValidator(@"D:\Checkiski\Checkiski.WebApi\stockfish.exe");
        }

        [Fact]
        public async Task Rejects_NoWinningLines()
        {
            // FEN where White is completely losing/dead drawn.
            var fen = "1k1r4/pp3p1p/5p2/8/8/8/PP3PPP/2R3K1 w - - 0 1";
            var solution = "c1c8"; // This is a terrible move that loses a rook

            bool isValid = await _validator.IsValidPuzzleAsync(fen, solution);
            Assert.False(isValid);
        }

        [Fact]
        public async Task Rejects_MultipleWinningLines()
        {
            // FEN where White has multiple completely winning moves.
            // Setup: White is up a queen and has multiple mating/winning lines.
            // Example: Mate in 1 with either Qh7 or Qg7.
            var fen = "7k/6pp/8/8/8/8/6QQ/7K w - - 0 1";
            var solution = "h2h7"; 

            bool isValid = await _validator.IsValidPuzzleAsync(fen, solution);
            Assert.False(isValid);
        }

        [Fact]
        public async Task Accepts_SingleWinningLine()
        {
            // Anastasia's mate in 2. Only one winning move.
            // Black king is trapped on h7. White plays Ne7+, Kh8, Rxh7#.
            var fen = "r1b2r1k/pp4pp/2p5/4N3/2B1n3/8/PPP2PPP/R3R1K1 w - - 0 1";
            var solution = "e5g6"; // e5g6+ h7g6 e1e3

            bool isValid = await _validator.IsValidPuzzleAsync(fen, solution);
            Assert.True(isValid);
        }
    }
}
