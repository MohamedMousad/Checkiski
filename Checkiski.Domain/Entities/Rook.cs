using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Domain.Entities
{
    public class Rook : Piece, IMovement
    {
        private static readonly Movement DefaultMovement = new Movement(
            XDiff: new List<int> { 1, 0, -1, 0 },
            YDiff: new List<int> { 0, 1, 0, -1 }
        );
        public Movement Movement => DefaultMovement;

        public Rook(Color color, Location location) : base(color, location)
        {
            this.Value = 5;
            this.Icon = color == Color.White ? "R" : "r";
        }
        public override List<Location> GetValidMoves(Board board)
        {
            // find own king
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

            List<Location> validMoves = new();
            for (int i = 0; i < Movement.XDiff.Count(); i++)
            {
                var dx = Movement.XDiff[i];
                var dy = Movement.YDiff[i];
                int nx = this.Location.X + dx;
                int ny = this.Location.Y + dy;
                while (nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7)
                {
                    Location current = new Location(nx, ny);
                    var destPiece = board.Squares[current.X, current.Y];
                    if (this.IsValidMove(board, current))
                    {
                        // simulate move
                        board.Squares[current.X, current.Y] = this;
                        board.Squares[this.Location.X, this.Location.Y] = new Empty(this.Location);
                        var originalLocation = this.Location;
                        this.Location = current;

                        if (king.IsCheck(board).Count == 0)
                            validMoves.Add(new Location(current.X, current.Y));

                        // revert
                        this.Location = originalLocation;
                        board.Squares[this.Location.X, this.Location.Y] = this;
                        board.Squares[current.X, current.Y] = destPiece;
                    }

                    if (destPiece is not Empty)
                        break;

                    nx += dx;
                    ny += dy;
                }
            }
            return validMoves;
        }
    }
}
