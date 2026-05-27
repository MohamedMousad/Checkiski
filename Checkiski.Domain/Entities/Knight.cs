using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Domain.Entities
{
    public class Knight : Piece , IMovement
    {
        private static readonly Movement DefaultMovement = new Movement(XDiff: new List<int> { 2, 1, -1, -2, -2, -1, 1, 2 }, 
                                                                        YDiff: new List<int> { 1, 2, 2, 1, -1, -2, -2, -1 });
        public Movement Movement => DefaultMovement;
        public Knight(Color color, Location location) : base(color, location)
        {
            this.Value = 3;
            this.Icon = color == Color.White ? "N" : "n";
        }
        public override List<Location> GetValidMoves(Board board)
        {
            // find the position of the king first to know if the knight is checking the king or not, and then we can add the valid moves accordingly
            King king = null!;
            for (int i =0  ; i < 8 ; i++)
            {
                for (int j = 0 ; j < 8 ; j++)
                {
                    if (board.Squares[i , j] is King && board.Squares[i , j].Color == this.Color)
                    {
                        king = (King) board.Squares[i , j];
                        break;   
                    }
                }
            }
            var validMoves = new List<Location>();
            for (int i = 0; i < Movement.XDiff.Count; i++)
            {
                try
                {
                    Location current = new(Location.X + Movement.XDiff[i],Location.Y + Movement.YDiff[i]);
                    var destPiece = board.Squares[current.X , current.Y];
                    if (this.IsValidMove(board, current))
                    {
                        board.Squares[current.X , current.Y] = this;
                        board.Squares[Location.X , Location.Y] = new Empty(Location);
                        var originalLocation = this.Location;
                        this.Location = current;
                        if (king.IsCheck(board).Count == 0)
                            validMoves.Add(current);
                        this.Location = originalLocation;
                        board.Squares[current.X , current.Y] = destPiece;
                        board.Squares[Location.X , Location.Y] = this;
                    }
                }
                catch (ArgumentException)
                {
                    continue;
                }
            }
            return validMoves;
        }
    }
}
