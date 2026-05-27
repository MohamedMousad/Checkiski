using Xunit;
using Checkiski.Domain.Entities;

namespace Checkiski.Tests
{
    public class ChessLogicTests
    {
        [Fact]
        public void Board_Initialization_SetupCorrectly()
        {
            var board = new Board();

            // Check corner pieces are Rooks
            Assert.True(board.Squares[0, 0] is Rook);
            Assert.Equal(Color.White, board.Squares[0, 0].Color);
            
            Assert.True(board.Squares[7, 7] is Rook);
            Assert.Equal(Color.Black, board.Squares[7, 7].Color);

            // Check kings are in correct initial positions
            Assert.True(board.Squares[4, 0] is King);
            Assert.Equal(Color.White, board.Squares[4, 0].Color);

            Assert.True(board.Squares[4, 7] is King);
            Assert.Equal(Color.Black, board.Squares[4, 7].Color);

            // Check pawn rows
            for (int x = 0; x < 8; x++)
            {
                Assert.True(board.Squares[x, 1] is Pawn);
                Assert.Equal(Color.White, board.Squares[x, 1].Color);

                Assert.True(board.Squares[x, 6] is Pawn);
                Assert.Equal(Color.Black, board.Squares[x, 6].Color);
            }
        }

        [Fact]
        public void Pawn_ValidMoves_FirstMove()
        {
            var board = new Board();
            var pawn = board.Squares[0, 1] as Pawn;
            
            Assert.NotNull(pawn);

            var validMoves = pawn.GetValidMoves(board);

            // A pawn on its starting square can move 1 or 2 squares forward.
            Assert.Contains(validMoves, loc => loc.X == 0 && loc.Y == 2);
            Assert.Contains(validMoves, loc => loc.X == 0 && loc.Y == 3);
            Assert.Equal(2, validMoves.Count);
        }

        [Fact]
        public void Knight_ValidMoves_InitialPosition()
        {
            var board = new Board();
            var knight = board.Squares[1, 0] as Knight; // White knight on b1

            Assert.NotNull(knight);

            var validMoves = knight.GetValidMoves(board);

            // Should be able to move to a3 or c3 over the pawns
            Assert.Contains(validMoves, loc => loc.X == 0 && loc.Y == 2); // a3
            Assert.Contains(validMoves, loc => loc.X == 2 && loc.Y == 2); // c3
            Assert.Equal(2, validMoves.Count);
        }

        [Fact]
        public void Piece_Move_UpdatesBoardState()
        {
            var board = new Board();
            var pawn = board.Squares[4, 1] as Pawn; // e2 pawn
            
            var targetLocation = new Location(4, 3); // e4
            
            bool moved = pawn!.Move(board, targetLocation);

            Assert.True(moved);
            Assert.Equal(targetLocation, pawn.Location);
            Assert.True(board.Squares[4, 3] is Pawn);
            Assert.True(board.Squares[4, 1] is Empty); // old square is empty
            Assert.True(pawn.Moved);
        }
    }
}
