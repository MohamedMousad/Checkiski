using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Models
{
    public class Queen : Piece
    {
        public Queen(Color color, Location location) : base(color, location)
        {
            this.Value = 9;
            this.Movement = new Movement { XDiff = new int[] { 1, 1, 1, 0, -1, -1, -1, 0 }, YDiff = new int[] { 1, 0, -1, -1, -1, 0, 1, 1 } };
            this.Icon = color == Color.White ? "Q" : "q";
        }

        public override List<Location> GetValidMoves()
        {
            throw new NotImplementedException();
        }
    }
}
