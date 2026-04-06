using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkiski.Models
{
    public static class Board
    {
        static public Piece[,] Squares = new Piece[8, 8];

        public static void initBoard()
        {
            // Start with an empty board.
            for (int x = 0; x < 8; x++)
            {
                for (int y = 0; y < 8; y++)
                {
                    var location = new Location { X = x, Y = y };
                    Squares[x, y] = new Empty(location)
                    {
                        Icon = ".",
                        Value = 0
                    };
                }
            }

            // White pieces.
            Squares[0, 0] = new Rook(Color.White, new Location { X = 0, Y = 0 });
            Squares[1, 0] = new Knight(Color.White, new Location { X = 1, Y = 0 });
            Squares[2, 0] = new Bishop(Color.White, new Location { X = 2, Y = 0 });
            Squares[3, 0] = new Queen(Color.White, new Location { X = 3, Y = 0 });
            Squares[4, 0] = new King(Color.White, new Location { X = 4, Y = 0 }) { Icon = "K", Value = 0 };
            Squares[5, 0] = new Bishop(Color.White, new Location { X = 5, Y = 0 });
            Squares[6, 0] = new Knight(Color.White, new Location { X = 6, Y = 0 });
            Squares[7, 0] = new Rook(Color.White, new Location { X = 7, Y = 0 });

            for (int x = 0; x < 8; x++)
            {
                Squares[x, 1] = new Pawn(Color.White, new Location { X = x, Y = 1 });
            }

            // Black pieces.
            Squares[0, 7] = new Rook(Color.Black, new Location { X = 0, Y = 7 });
            Squares[1, 7] = new Knight(Color.Black, new Location { X = 1, Y = 7 });
            Squares[2, 7] = new Bishop(Color.Black, new Location { X = 2, Y = 7 });
            Squares[3, 7] = new Queen(Color.Black, new Location { X = 3, Y = 7 });
            Squares[4, 7] = new King(Color.Black, new Location { X = 4, Y = 7 }) { Icon = "k", Value = 0 };
            Squares[5, 7] = new Bishop(Color.Black, new Location { X = 5, Y = 7 });
            Squares[6, 7] = new Knight(Color.Black, new Location { X = 6, Y = 7 });
            Squares[7, 7] = new Rook(Color.Black, new Location { X = 7, Y = 7 });

            for (int x = 0; x < 8; x++)
            {
                Squares[x, 6] = new Pawn(Color.Black, new Location { X = x, Y = 6 });
            }

            MoveHistory.Clear();
        }

        static public List<Move> MoveHistory = new List<Move>();
    }
}
