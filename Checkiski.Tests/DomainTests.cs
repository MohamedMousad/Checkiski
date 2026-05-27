using Checkiski.Domain.Entities;
using Xunit;

namespace Checkiski.Tests
{
    public class DomainTests
    {
        [Fact]
        public void Board_Initialization_SetsUpCorrectly()
        {
            var board = new Board();
            Assert.IsType<Rook>(board.Squares[0, 0]);
            Assert.IsType<Knight>(board.Squares[1, 0]);
            Assert.IsType<Bishop>(board.Squares[2, 0]);
            Assert.IsType<Queen>(board.Squares[3, 0]);
            Assert.IsType<King>(board.Squares[4, 0]);
            Assert.IsType<Bishop>(board.Squares[5, 0]);
            Assert.IsType<Knight>(board.Squares[6, 0]);
            Assert.IsType<Rook>(board.Squares[7, 0]);
            
            for (int i = 0; i < 8; i++)
            {
                Assert.IsType<Pawn>(board.Squares[i, 1]);
                Assert.IsType<Pawn>(board.Squares[i, 6]);
            }

            Assert.Equal(Color.White, board.CurrentTurn);
        }

        [Fact]
        public void ValidMove_UpdatesBoardState()
        {
            var board = new Board();
            var pawn = board.Squares[4, 1];
            bool success = pawn.Move(board, new Location(4, 3));
            
            Assert.True(success);
            Assert.IsType<Empty>(board.Squares[4, 1]);
            Assert.IsType<Pawn>(board.Squares[4, 3]);
            Assert.Equal(Color.Black, board.CurrentTurn);
        }

        [Fact]
        public void Castling_Kingside_MovesKingAndRook()
        {
            var board = new Board();
            board.LoadFen("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
            
            var king = board.Squares[4, 0];
            bool success = king.Move(board, new Location(6, 0));
            
            Assert.True(success);
            Assert.IsType<King>(board.Squares[6, 0]);
            Assert.IsType<Rook>(board.Squares[5, 0]);
            Assert.IsType<Empty>(board.Squares[7, 0]);
        }

        [Fact]
        public void EnPassant_CapturesOpponentPawn()
        {
            var board = new Board();
            
            board.LoadFen("rnbqkbnr/pppppppp/8/3P4/8/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1");
            var blackPawn = board.Squares[4, 6]; // e7
            blackPawn.Move(board, new Location(4, 4)); // e5

            var whitePawn = board.Squares[3, 4]; // d5
            bool success = whitePawn.Move(board, new Location(4, 5)); // dxe6
            
            Assert.True(success);
            Assert.IsType<Empty>(board.Squares[4, 4]); // e5 should be empty (captured)
            Assert.IsType<Pawn>(board.Squares[4, 5]); // e6 has our pawn
        }

        [Fact]
        public void Checkmate_DetectsMateCorrectly()
        {
            var board = new Board(); // standard start
            board.Squares[5, 1].Move(board, new Location(5, 2)); // f2-f3
            board.Squares[4, 6].Move(board, new Location(4, 4)); // e7-e5
            board.Squares[6, 1].Move(board, new Location(6, 3)); // g2-g4
            board.Squares[3, 7].Move(board, new Location(7, 3)); // Qd8-h4
            
            King whiteKing = (King)board.Squares[4, 0];
            bool isMate = whiteKing.IsMate(board);
            if (!isMate)
            {
                string info = "";
                for (int i = 0; i < 8; i++)
                {
                    for (int j = 0; j < 8; j++)
                    {
                        if (board.Squares[i, j] is Piece piece && piece.Color == Color.White && piece is not Empty)
                        {
                            var vm = piece.GetValidMoves(board);
                            if (vm.Count > 0)
                            {
                                info += $"{piece.Icon} at ({i},{j}) can move to: ";
                                foreach(var m in vm) info += $"({m.X},{m.Y}) ";
                                info += "\n";
                            }
                        }
                    }
                }
                Assert.Fail("Not mate! Valid moves:\n" + info);
            }
        }

        [Fact]
        public void Draw_FiftyMoveRule_ReturnsDraw()
        {
            var board = new Board();
            board.LoadFen("8/8/8/8/8/8/5k2/7K w - - 100 1");
            
            Assert.True(board.IsDraw());
        }
    }
}
