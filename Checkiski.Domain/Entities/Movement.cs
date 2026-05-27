using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Domain.Entities
{
    public class Movement
    {
        public List<int> XDiff {get;set;}
        public List<int> YDiff {get;set;}
        public Movement(List<int> XDiff, List<int> YDiff)
        {
            if (XDiff.Count != YDiff.Count)
            {
                throw new ArgumentException("XDiff and YDiff must have the same number of elements.");
            }
            this.XDiff = XDiff;
            this.YDiff = YDiff;
        }
    }
}
