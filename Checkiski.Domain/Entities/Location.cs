using System;
using System.Collections.Generic;

namespace Checkiski.Domain.Entities
{
    public class Location : IEquatable<Location>
    {
        public Location(int x, int y)
        {
            if (x < 0 || x > 7 || y < 0 || y > 7)
            {
                throw new ArgumentException("Location coordinates must be between 0 and 7 inclusive.");
            }
            this.X = x;
            this.Y = y;
        }
        
        public int X { get; init; }
        public int Y { get; init; }

        public override int GetHashCode()
        {
            // Simple robust hash for 8x8 grid: Y * 8 + X gives a unique 0-63 value.
            return this.Y * 8 + this.X;
        }

        public override bool Equals(object? obj)
        {
            return Equals(obj as Location);
        }

        public bool Equals(Location? other)
        {
            if (other is null) return false;
            return this.X == other.X && this.Y == other.Y;
        }
    }
}
