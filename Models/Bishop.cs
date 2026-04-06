using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Models
{
    public class Bishop : Piece
    {
        public Bishop(Color color, Location location) : base(color, location)
        {
            this.Value = 3;
            this.Icon = color == Color.White ? "B" : "b";
            this.Movement = new Movement { XDiff = new int[] { 1, 1, -1, -1 }, YDiff = new int[] { 1, -1, 1, -1 } };
        }
        public override List<Location> GetValidMoves()
        {
            throw new NotImplementedException();
        }
    }
}