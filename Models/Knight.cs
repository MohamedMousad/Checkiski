using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Models
{
    public class Knight : Piece
    {
        public Knight(Color color, Location location) : base(color, location)
        {
            this.Movement = new Movement { XDiff = new int[] { 2, 2, -2, -2, 1, 1, -1, -1 }, YDiff = new int[] { 1, -1, 1, -1, 2, -2, 2, -2 } };
            this.Value = 3;
            this.Icon = color == Color.White ? "N" : "n";
        }
        public override List<Location> GetValidMoves()
        {
            throw new NotImplementedException();
        }
    }
}