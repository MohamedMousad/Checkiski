using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Models
{
    public class Move
    {
        public Location From { get; set;}
        public Location To { get; set;}
    }
}