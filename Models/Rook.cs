using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Models
{
    public class Rook : Piece
    {
        public Rook(Color color, Location location) : base(color, location)
        {
            this.Value = 5;
            this.Icon = color == Color.White ? "R" : "r";
            this.Movement = new Movement { XDiff = new int[] { 1, 0, -1, 0 }, YDiff = new int[] { 0, 1, 0, -1 } };
        }

        public override List<Location> GetValidMoves()
        {
            throw new NotImplementedException();
        }
    }
}
