using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Domain.Entities
{
    public abstract class Piece
    {
        protected Piece(Color color, Location location)
        {
            this.Color = color;
            this.Location = location;
            this.Moved = false;
        }
        public bool Moved { get; set; }
        public string? Icon { get; init; }
        public Location Location { get; set; }
        public int Value { get; init; }
        public Color Color { get; set; }
        public abstract List<Location> GetValidMoves(Board board);
        public virtual bool Move(Board board, Location location, char? promotion = null)
        {
            List<Location>? AllowedMoves = this.GetValidMoves(board);
            if (!this.Location.Equals(location) && AllowedMoves.Any(current => current.Equals(location)))
            {
                var oldLocation = this.Location;
                bool isCapture = false;

                if (this is Pawn && oldLocation.X != location.X && board.Squares[location.X, location.Y] is Empty)
                {
                    var capturedPawn = board.Squares[location.X, oldLocation.Y];
                    if (capturedPawn.Color == Color.Black)
                        board.BlackTaken.Add(capturedPawn);
                    else
                        board.WhiteTaken.Add(capturedPawn);
                    board.Squares[location.X, oldLocation.Y] = new Empty(new Location(location.X, oldLocation.Y));
                    isCapture = true;
                }
                else if (board.Squares[location.X, location.Y] is not Empty)
                {
                    if (board.Squares[location.X, location.Y].Color == Color.Black)
                        board.BlackTaken.Add(board.Squares[location.X, location.Y]);
                    else
                        board.WhiteTaken.Add(board.Squares[location.X, location.Y]);
                    isCapture = true;
                }

                this.Location = location;
                board.Squares[location.X, location.Y] = this;
                board.Squares[oldLocation.X, oldLocation.Y] = new Empty(oldLocation);
                this.Moved = true;

                // Castling rook movement
                if (this is King && Math.Abs(location.X - oldLocation.X) == 2)
                {
                    if (location.X > oldLocation.X) // Short castle
                    {
                        var rook = board.Squares[7, location.Y];
                        board.Squares[location.X - 1, location.Y] = rook;
                        board.Squares[7, location.Y] = new Empty(new Location(7, location.Y));
                        rook.Location = new Location(location.X - 1, location.Y);
                        rook.Moved = true;
                    }
                    else // Long castle
                    {
                        var rook = board.Squares[0, location.Y];
                        board.Squares[location.X + 1, location.Y] = rook;
                        board.Squares[0, location.Y] = new Empty(new Location(0, location.Y));
                        rook.Location = new Location(location.X + 1, location.Y);
                        rook.Moved = true;
                    }
                }
                
                if (this is Pawn || isCapture)
                    board.HalfMoveClock = 0;
                else
                    board.HalfMoveClock++;

                board.MoveHistory.Add(new Move(oldLocation, location));

                if (this is Pawn pawn)
                    pawn.Promote(board, promotion);
                
                board.NextTurn();
                return true;
            }
            return false;
        }
        public bool IsValidMove(Board board)
        {
            return !(board.Squares[this.Location.X, this.Location.Y].Color == this.Color && board.Squares[this.Location.X, this.Location.Y] is not Empty);
        }
        public bool IsValidMove(Board board, Location location)
        {
            if (location.X < 0 || location.X > 7 || location.Y < 0 || location.Y > 7)
                return false;
            return !(board.Squares[location.X, location.Y].Color == this.Color && board.Squares[location.X, location.Y] is not Empty);
        }
        public ISet<Location> IsCheck(Board board)
        {
            // inverse of knight moves to back-track
            var knightMovement = new Knight(this.Color, this.Location).Movement;
            var dx_knight = knightMovement.XDiff;
            var dy_knight = knightMovement.YDiff;
            // inverse of bishop/queen moves to back-track
            var bishopMovement = new Bishop(this.Color, this.Location).Movement;
            var dx_bishop = bishopMovement.XDiff;
            var dy_bishop = bishopMovement.YDiff;
            // inverse of rook/queen moves to back-track
            var rookMovement = new Rook(this.Color, this.Location).Movement;
            var dx_rook = rookMovement.XDiff;
            var dy_rook = rookMovement.YDiff;
            var pos = this.Location;
            ISet<Location> checkedLocations = new HashSet<Location>();
            // checking knight locations
            for (int i = 0; i < 8; i++)
            {
                var nx = pos.X + dx_knight[i]; var ny = pos.Y + dy_knight[i];
                if (nx < 0 || nx > 7 || ny < 0 || ny > 7) continue;
                var dummy = new Knight(this.Color, new Location(nx, ny));
                if (dummy.IsValidMove(board) && board.Squares[nx, ny] is Knight && board.Squares[nx, ny].Color != this.Color)
                    checkedLocations.Add(new Location(nx, ny));
            }
            // checking bishop locations
            for (int i = 0; i < 4; i++)
            {
                int nx = pos.X + dx_bishop[i]; var ny = pos.Y + dy_bishop[i];
                while (true)
                {
                    if (nx < 0 || nx > 7 || ny < 0 || ny > 7) break;
                    var piece = board.Squares[nx, ny];
                    if (piece.Color != this.Color && (piece is Bishop || piece is Queen))
                    {
                        checkedLocations.Add(new Location(nx, ny));
                        break;
                    }
                    if (piece is not Empty) break;
                    nx += dx_bishop[i];
                    ny += dy_bishop[i];
                }
            }
            // checking rook locations
            for (int i = 0; i < 4; i++)
            {
                int nx = pos.X + dx_rook[i], ny = pos.Y + dy_rook[i];
                while (true)
                {
                    if (nx < 0 || nx > 7 || ny < 0 || ny > 7) break;
                    var piece = board.Squares[nx, ny];
                    if (piece.Color != this.Color && (piece is Rook || piece is Queen))
                    {
                        checkedLocations.Add(new Location(nx, ny));
                        break;
                    }
                    if (piece is not Empty) break;
                    nx += dx_rook[i];
                    ny += dy_rook[i];
                }
            }
            // checking pawn attacks
            int pawnDir = this.Color == Color.White ? 1 : -1;
            int checkY = pos.Y + pawnDir;
            if (checkY >= 0 && checkY <= 7)
            {
                if (pos.X - 1 >= 0 && board.Squares[pos.X - 1, checkY] is Pawn p1 && p1.Color != this.Color)
                    checkedLocations.Add(new Location(pos.X - 1, checkY));
                if (pos.X + 1 <= 7 && board.Squares[pos.X + 1, checkY] is Pawn p2 && p2.Color != this.Color)
                    checkedLocations.Add(new Location(pos.X + 1, checkY));
            }
            return checkedLocations;
        }
    }
}
