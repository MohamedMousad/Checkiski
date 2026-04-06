using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Models
{
    public class Pawn : Piece
    {
        // needs implementing en passant and promotion
        public Pawn(Color color, Location location) : base(color, location)
        {
            this.Value = 1;
            this.Icon = color == Color.White ? "P" : "p";
            this.Direction = color == Color.White ? 1 : -1;
        }

        public int Direction { get; set; }
        public override List<Location> GetValidMoves()
        {
            // still need to implement en passant and promotion
            List<Location> validMoves = new List<Location>();
            if (Board.Squares[this.Location.X, this.Location.Y + 1 * Direction] is Empty)
                validMoves.Add(new Location { X = this.Location.X, Y = this.Location.Y + 1 * Direction });
            if (Board.Squares[this.Location.X, this.Location.Y + 1 * Direction] is Empty)
                validMoves.Add(new Location { X = this.Location.X, Y = this.Location.Y + 2 * Direction });
            validMoves.AddRange(CanTake(this.Location));
            validMoves.Add(CatchEnPassant());
            return validMoves;
        }
        public Location CatchEnPassant()
        {
            Location location = new();
            if (Board.Squares[Board.MoveHistory.Last().To.X, Board.MoveHistory.Last().To.Y] is Pawn && Board.MoveHistory.Last().To.Y == this.Location.Y &&
                (Board.MoveHistory.Last().To.X == this.Location.X + 1 || Board.MoveHistory.Last().To.X == this.Location.X - 1))
                location = new Location { X = Board.MoveHistory.Last().To.X, Y = Board.MoveHistory.Last().To.Y + 1 * Direction };
            return location;
        }
        public List<Location> CanTake(Location location)
        {
            List<Location> validMoves = new List<Location>();
            if (IsValidMove(new Location
            {
                X = location.X + 1,
                Y = location.Y + 1 * Direction
            })
            && Board.Squares[location.X + 1, location.Y + 1 * Direction] is not Empty && Board.Squares[location.X + 1, location.Y + 1 * Direction].Color != this.Color)
                return new List<Location> { location };

            if (IsValidMove(new Location
            {
                X = location.X - 1,
                Y = location.Y + 1 * Direction
            }) && Board.Squares[location.X - 1, location.Y + 1 * Direction] is not Empty && Board.Squares[location.X - 1, location.Y + 1 * Direction].Color != this.Color)
                return new List<Location> { location };

            return new List<Location>();
        }
        public void Promote(Piece piece)
        {
            if (this.Location.Y == 0 || this.Location.Y == 7)
            {
                // fetch user input for piece to promote to, for now just promote to queen
                if (piece is Rook)
                    Board.Squares[this.Location.X, this.Location.Y] = new Rook(this.Color, this.Location);
                else if (piece is Knight)
                    Board.Squares[this.Location.X, this.Location.Y] = new Knight(this.Color, this.Location);
                else if (piece is Bishop)
                    Board.Squares[this.Location.X, this.Location.Y] = new Bishop(this.Color, this.Location);
                // promote to queen for now
                Board.Squares[this.Location.X, this.Location.Y] = new Queen(this.Color, location: this.Location);
            }
        }
    }
}
