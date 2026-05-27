using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Domain.Entities
{
    public class Empty : Piece
    {
        public Empty(Location location) : base(Color.None, location)
        {
            this.Value = 0;
            this.Icon = ".";
        }
        public override List<Location> GetValidMoves(Board board)
        {
            throw new NotImplementedException();
        }
    }
}
