using System;
using System.Collections.Generic;

namespace Checkiski.Domain.Entities
{
    public class Board
    {
        public List<Piece> BlackTaken { get; set; } = new();
        public List<Piece> WhiteTaken { get; set; } = new();
        public Piece[,] Squares { get; set; } = new Piece[8, 8];
        public List<Move> MoveHistory { get; set; } = new();
        public Color CurrentTurn { get; set; } = Color.White;
        public int HalfMoveClock { get; set; } = 0;
        public int FullMoveNumber { get; set; } = 1;

        public Board()
        {
            InitBoard();
        }

        public void InitBoard()
        {
            BlackTaken.Clear();
            WhiteTaken.Clear();
            MoveHistory.Clear();

            // Start with an empty board.
            for (int x = 0; x < 8; x++)
            {
                for (int y = 0; y < 8; y++)
                {
                    var location = new Location(x, y);
                    Squares[x, y] = new Empty(location)
                    {
                        Icon = ".",
                        Value = 0
                    };
                }
            }

            // White pieces.
            Squares[0, 0] = new Rook(Color.White, new Location(0, 0));
            Squares[1, 0] = new Knight(Color.White, new Location(1, 0));
            Squares[2, 0] = new Bishop(Color.White, new Location(2, 0));
            Squares[3, 0] = new Queen(Color.White, new Location(3, 0));
            Squares[4, 0] = new King(Color.White, new Location(4, 0)) { Icon = "K", Value = 0 };
            Squares[5, 0] = new Bishop(Color.White, new Location(5, 0));
            Squares[6, 0] = new Knight(Color.White, new Location(6, 0));
            Squares[7, 0] = new Rook(Color.White, new Location(7, 0));

            for (int x = 0; x < 8; x++)
            {
                Squares[x, 1] = new Pawn(Color.White, new Location(x, 1));
            }

            // Black pieces.
            Squares[0, 7] = new Rook(Color.Black, new Location(0, 7));
            Squares[1, 7] = new Knight(Color.Black, new Location(1, 7));
            Squares[2, 7] = new Bishop(Color.Black, new Location(2, 7));
            Squares[3, 7] = new Queen(Color.Black, new Location(3, 7));
            Squares[4, 7] = new King(Color.Black, new Location(4, 7)) { Icon = "k", Value = 0 };
            Squares[5, 7] = new Bishop(Color.Black, new Location(5, 7));
            Squares[6, 7] = new Knight(Color.Black, new Location(6, 7));
            Squares[7, 7] = new Rook(Color.Black, new Location(7, 7));

            for (int x = 0; x < 8; x++)
            {
                Squares[x, 6] = new Pawn(Color.Black, new Location(x, 6));
            }
            CurrentTurn = Color.White;
            HalfMoveClock = 0;
            FullMoveNumber = 1;
        }

        public void NextTurn()
        {
            CurrentTurn = CurrentTurn == Color.White ? Color.Black : Color.White;
            if (CurrentTurn == Color.White)
                FullMoveNumber++;
        }

        public bool IsDraw()
        {
            if (HalfMoveClock >= 100) return true; // 50-move rule
            return IsInsufficientMaterial();
        }

        private bool IsInsufficientMaterial()
        {
            var pieces = new List<Piece>();
            for (int x = 0; x < 8; x++)
            {
                for (int y = 0; y < 8; y++)
                {
                    if (Squares[x, y] is not Empty)
                        pieces.Add(Squares[x, y]);
                }
            }

            if (pieces.Count == 2) return true; // King vs King
            if (pieces.Count == 3)
            {
                if (pieces.Any(p => p is Knight || p is Bishop)) return true; // King + Knight/Bishop vs King
            }
            if (pieces.Count == 4)
            {
                var bishops = pieces.Where(p => p is Bishop).ToList();
                if (bishops.Count == 2 && bishops[0].Color != bishops[1].Color)
                {
                    // Check if bishops are on same color squares
                    bool sameColor = (bishops[0].Location.X + bishops[0].Location.Y) % 2 == (bishops[1].Location.X + bishops[1].Location.Y) % 2;
                    if (sameColor) return true; // King + Bishop vs King + Bishop on same color
                }
            }
            return false;
        }

        public string ToFen()
        {
            var fen = "";
            for (int y = 7; y >= 0; y--)
            {
                int emptyCount = 0;
                for (int x = 0; x < 8; x++)
                {
                    var piece = Squares[x, y];
                    if (piece is Empty)
                    {
                        emptyCount++;
                    }
                    else
                    {
                        if (emptyCount > 0)
                        {
                            fen += emptyCount.ToString();
                            emptyCount = 0;
                        }
                        fen += piece.Icon;
                    }
                }
                if (emptyCount > 0)
                    fen += emptyCount.ToString();
                if (y > 0) fen += "/";
            }

            fen += $" {(CurrentTurn == Color.White ? "w" : "b")} ";
            
            // Castling rights (simplified, based on moved flags)
            string castling = "";
            if (Squares[4, 0] is King wk && !wk.Moved)
            {
                if (Squares[7, 0] is Rook wr && !wr.Moved) castling += "K";
                if (Squares[0, 0] is Rook wr2 && !wr2.Moved) castling += "Q";
            }
            if (Squares[4, 7] is King bk && !bk.Moved)
            {
                if (Squares[7, 7] is Rook br && !br.Moved) castling += "k";
                if (Squares[0, 7] is Rook br2 && !br2.Moved) castling += "q";
            }
            fen += castling == "" ? "-" : castling;

            // En passant target square
            string enPassant = "-";
            if (MoveHistory.Count > 0)
            {
                var lastMove = MoveHistory.Last();
                var lastPiece = Squares[lastMove.To.X, lastMove.To.Y];
                if (lastPiece is Pawn && Math.Abs(lastMove.From.Y - lastMove.To.Y) == 2)
                {
                    char file = (char)('a' + lastMove.To.X);
                    int rank = CurrentTurn == Color.White ? 6 : 3;
                    enPassant = $"{file}{rank}";
                }
            }
            fen += $" {enPassant} {HalfMoveClock} {FullMoveNumber}";
            return fen;
        }

        public void LoadFen(string fen)
        {
            BlackTaken.Clear();
            WhiteTaken.Clear();
            MoveHistory.Clear();
            
            var parts = fen.Split(' ');
            var ranks = parts[0].Split('/');
            
            for (int y = 0; y < 8; y++)
            {
                string rankStr = ranks[7 - y];
                int x = 0;
                foreach (char c in rankStr)
                {
                    if (char.IsDigit(c))
                    {
                        int emptyCount = c - '0';
                        for (int i = 0; i < emptyCount; i++)
                        {
                            Squares[x, y] = new Empty(new Location(x, y));
                            x++;
                        }
                    }
                    else
                    {
                        var color = char.IsUpper(c) ? Color.White : Color.Black;
                        Piece p = char.ToLower(c) switch
                        {
                            'p' => new Pawn(color, new Location(x, y)),
                            'r' => new Rook(color, new Location(x, y)),
                            'n' => new Knight(color, new Location(x, y)),
                            'b' => new Bishop(color, new Location(x, y)),
                            'q' => new Queen(color, new Location(x, y)),
                            'k' => new King(color, new Location(x, y)),
                            _ => new Empty(new Location(x, y))
                        };
                        Squares[x, y] = p;
                        x++;
                    }
                }
            }

            if (parts.Length > 1) CurrentTurn = parts[1] == "w" ? Color.White : Color.Black;
            HalfMoveClock = 0;
            if (parts.Length > 4 && int.TryParse(parts[4], out int half)) HalfMoveClock = half;
            FullMoveNumber = 1;
            if (parts.Length > 5 && int.TryParse(parts[5], out int full)) FullMoveNumber = full;
            
            // Note: In a complete implementation, Castling rights (parts[2]) and En Passant (parts[3]) 
            // should also be applied to Piece.Moved and MoveHistory states respectively.
        }
    }
}
