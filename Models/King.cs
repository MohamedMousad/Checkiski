using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Models
{
    public class King : Piece
    {
        public King(Color color, Location location) : base(color, location)
        {
            this.Movement = new Movement { XDiff = new int[] { 1, 1, 1, 0, -1, -1, -1, 0 }, YDiff = new int[] { 1, 0, -1, -1, -1, 0, 1, 1 } };
            this.Value = int.MaxValue;
            this.Icon = color == Color.White ? "K" : "k";
        }
        public override List<Location> GetValidMoves()
        {
            throw new NotImplementedException();
        }
    }
}