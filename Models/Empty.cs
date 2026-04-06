using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Models
{
    public class Empty : Piece
    {
        public Empty(Location location) : base(Color.None, location)
        {
            this.Value = 0;
            this.Icon = ".";
            this.Movement = new Movement { XDiff = new int[] { }, YDiff = new int[] { } };
        }
        public override List<Location> GetValidMoves()
        {
            throw new NotImplementedException();
        }
    }
}