using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Domain.Entities
{
    public class Pawn : Piece
    {
        public Pawn(Color color, Location location) : base(color, location)
        {
            this.Value = 1;
            this.Icon = color == Color.White ? "P" : "p";
            this.Direction = color == Color.White ? 1 : -1;
        }

        public int Direction { get; set; }
        public override List<Location> GetValidMoves(Board board)
        {
            List<Location> validMoves = new List<Location>();

            var x = this.Location.X;
            var y = this.Location.Y;
            var oneStepY = y + Direction;

            if (IsOnBoard(x, oneStepY) && board.Squares[x, oneStepY] is Empty)
            {
                validMoves.Add(new Location(x, oneStepY));

                var startRank = this.Color == Color.White ? 1 : 6;
                var twoStepY = y + 2 * Direction;
                if (!this.Moved && y == startRank && IsOnBoard(x, twoStepY) && board.Squares[x, twoStepY] is Empty)
                {
                    validMoves.Add(new Location(x, twoStepY));
                }
            }

            validMoves.AddRange(CaptureMoves(board));

            var enPassant = CatchEnPassant(board);
            if (enPassant != null)
                validMoves.Add(enPassant);

            // Filter out moves that leave king in check
            King king = null!;
            for (int i = 0; i < 8; i++)
            {
                for (int j = 0; j < 8; j++)
                {
                    if (board.Squares[i, j] is King && board.Squares[i, j].Color == this.Color)
                    {
                        king = (King)board.Squares[i, j];
                        break;
                    }
                }
            }

            var safeMoves = new List<Location>();
            foreach (var move in validMoves)
            {
                var destPiece = board.Squares[move.X, move.Y];
                
                // En Passant capture simulation requires removing the captured pawn
                Piece? capturedEnPassant = null;
                if (move.X != this.Location.X && destPiece is Empty)
                {
                    capturedEnPassant = board.Squares[move.X, this.Location.Y];
                    board.Squares[move.X, this.Location.Y] = new Empty(new Location(move.X, this.Location.Y));
                }

                // Simulate
                board.Squares[move.X, move.Y] = this;
                board.Squares[this.Location.X, this.Location.Y] = new Empty(this.Location);
                var originalLocation = this.Location;
                this.Location = move;

                if (king.IsCheck(board).Count == 0)
                    safeMoves.Add(move);

                // Revert
                this.Location = originalLocation;
                board.Squares[this.Location.X, this.Location.Y] = this;
                board.Squares[move.X, move.Y] = destPiece;
                
                if (capturedEnPassant != null)
                    board.Squares[move.X, this.Location.Y] = capturedEnPassant;
            }

            return safeMoves;
        }
        public Location? CatchEnPassant(Board board)
        {
            if (board.MoveHistory.Count == 0)
                return null;

            var lastMove = board.MoveHistory.Last();
            var lastPiece = board.Squares[lastMove.To.X, lastMove.To.Y];
            if (lastPiece is not Pawn || lastPiece.Color == this.Color)
                return null;

            var movedTwo = Math.Abs(lastMove.From.Y - lastMove.To.Y) == 2;
            var adjacentFile = Math.Abs(lastMove.To.X - this.Location.X) == 1;
            var sameRank = lastMove.To.Y == this.Location.Y;

            if (!movedTwo || !adjacentFile || !sameRank)
                return null;

            var targetY = lastMove.To.Y + Direction;
            if (!IsOnBoard(lastMove.To.X, targetY))
                return null;

            return new Location(lastMove.To.X, targetY);
        }
        private List<Location> CaptureMoves(Board board)
        {
            var validMoves = new List<Location>();
            var leftX = this.Location.X - 1;
            var rightX = this.Location.X + 1;
            var targetY = this.Location.Y + Direction;

            if (IsOnBoard(leftX, targetY))
            {
                var leftPiece = board.Squares[leftX, targetY];
                if (leftPiece is not Empty && leftPiece.Color != this.Color)
                    validMoves.Add(new Location(leftX, targetY));
            }

            if (IsOnBoard(rightX, targetY))
            {
                var rightPiece = board.Squares[rightX, targetY];
                if (rightPiece is not Empty && rightPiece.Color != this.Color)
                    validMoves.Add(new Location(rightX, targetY));
            }

            return validMoves;
        }
        public void Promote(Board board, char? choice = null)
        {
            if (!IsPromotionRank())
                return;

            Piece promoted;
            choice = choice != null ? char.ToLower(choice.Value) : 'q';
            switch (choice)
            {
                case 'r': promoted = new Rook(this.Color, this.Location); break;
                case 'n': promoted = new Knight(this.Color, this.Location); break;
                case 'b': promoted = new Bishop(this.Color, this.Location); break;
                default: promoted = new Queen(this.Color, this.Location); break;
            }

            board.Squares[this.Location.X, this.Location.Y] = promoted;
        }

        private bool IsPromotionRank()
        {
            return this.Location.Y == 0 || this.Location.Y == 7;
        }

        private static bool IsOnBoard(int x, int y)
        {
            return x >= 0 && x <= 7 && y >= 0 && y <= 7;
        }
    }
}
