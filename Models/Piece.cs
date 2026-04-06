using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Models
{
    public abstract class Piece
    {
        protected Piece(Color color, Location location)
        {
            this.Color = color;
            this.Location = location;
        }
        public string? Icon { get; init; }
        public Location Location { get; set; }
        public int Value { get; init; }
        public Movement Movement { get; set; }
        public Color Color { get; set; }
        public abstract List<Location> GetValidMoves();
        public bool IsValidMove(Location location)
        {
            if (location.X < 0 || location.X > 7 || location.Y < 0 || location.Y > 7)
                return false;
            return true;
        }
    }
}