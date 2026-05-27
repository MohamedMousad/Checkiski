using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Domain.Entities
{
    public class King : Piece, IMovement
    {
        private static readonly Movement DefaultMovement = new Movement(
            XDiff: new List<int> { 1, 1, 1, 0, -1, -1, -1, 0 },
            YDiff: new List<int> { 1, 0, -1, -1, -1, 0, 1, 1 }
        );
        public Movement Movement => DefaultMovement;

        public King(Color color, Location location) : base(color, location)
        {
            this.Value = int.MaxValue;
            this.Icon = color == Color.White ? "K" : "k";
        }
        public override List<Location> GetValidMoves(Board board)
        {
            var validMoves = new List<Location>();
            for (int i = 0; i < Movement.XDiff.Count; i++)
            {
                try{
                    Location current = new(Location.X + Movement.XDiff[i] , Location.Y + Movement.YDiff[i]);
                    var destPiece = board.Squares[current.X, current.Y];
                    if (this.IsValidMove(board, current))
                    {
                        // simulate move
                        board.Squares[current.X, current.Y] = this;
                        board.Squares[this.Location.X, this.Location.Y] = new Empty(this.Location);
                        var originalLocation = this.Location;
                        this.Location = current;

                        if (this.IsCheck(board).Count == 0)
                            validMoves.Add(new Location(current.X, current.Y));

                        // revert
                        this.Location = originalLocation;
                        board.Squares[this.Location.X, this.Location.Y] = this;
                        board.Squares[current.X, current.Y] = destPiece;
                    }
                }
                catch (ArgumentException)
                {
                    continue;
                }
            }

            if (CanShortCastle(board))
                validMoves.Add(new Location(this.Location.X + 2, this.Location.Y));
            if (CanLongCastle(board))
                validMoves.Add(new Location(this.Location.X - 2, this.Location.Y));

            return validMoves;
        }
        public bool IsMate(Board board)
        {
            if (IsCheck(board).Count == 0)
                return false;

            for (int i = 0; i < 8; i++)
            {
                for (int j = 0; j < 8; j++)
                {
                    if (board.Squares[i, j] is Piece piece && piece.Color == this.Color)
                    {
                        if (piece.GetValidMoves(board).Count > 0)
                            return false;
                    }
                }
            }
            return true;
        }
        
        public bool IsStalemate(Board board)
        {
            if (IsCheck(board).Count > 0)
                return false;
            
            for (int i = 0; i < 8; i++)
            {
                for (int j = 0; j < 8; j++)
                {
                    if (board.Squares[i, j] is Piece piece && piece.Color == this.Color)
                    {
                        if (piece.GetValidMoves(board).Count > 0)
                            return false;
                    }
                }
            }
            return true;
        }
        public bool CanShortCastle(Board board)
        {
            var current = this.Location;
            if (current.X + 3 > 7) return false;
            if (this.IsCheck(board).Count > 0 || this.Moved || board.Squares[current.X + 3, current.Y].Moved) return false;
            if (board.Squares[current.X + 1, current.Y] is not Empty || board.Squares[current.X + 2, current.Y] is not Empty) return false;
            var dummy1 = new King(this.Color, new Location(current.X + 1, current.Y));
            var dummy2 = new King(this.Color, new Location(current.X + 2, current.Y));
            return dummy1.IsCheck(board).Count == 0 && dummy2.IsCheck(board).Count == 0;
        }
        public bool CanLongCastle(Board board)
        {
            var current = this.Location;
            if (current.X - 4 < 0) return false;
            if (this.IsCheck(board).Count > 0 || this.Moved || board.Squares[current.X - 4, current.Y].Moved) return false;
            if (board.Squares[current.X - 1, current.Y] is not Empty || board.Squares[current.X - 2, current.Y] is not Empty || board.Squares[current.X - 3, current.Y] is not Empty) return false;
            var dummy1 = new King(this.Color, new Location(current.X - 1, current.Y));
            var dummy2 = new King(this.Color, new Location(current.X - 2, current.Y));
            return dummy1.IsCheck(board).Count == 0 && dummy2.IsCheck(board).Count == 0;
        }
    }
}
