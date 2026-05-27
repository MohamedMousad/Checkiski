using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Domain.Entities
{
    public class Move
    {
        public Move (Location from , Location to)
        {
            this.From = from;
            this.To = to;
        } 
        public Location From { get; set;}
        public Location To { get; set;}
    }
}
