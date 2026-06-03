using System;
using Checkiski.Domain.Entities;
using Checkiski.Domain.ValueObjects;

class Program
{
    static void Main()
    {
        var board = new Board(); // Start position
        
        // Move 1: e4
        var p1 = board.Squares[4, 1];
        p1.Move(board, new Location(4, 3));
        board.NextTurn(); // Wait, Piece.Move already calls NextTurn! Let's NOT call it!
        
        Console.WriteLine($"After e4: {board.ToFen()}");
        
        // Move 2: e5
        var fen1 = board.ToFen();
        var b2 = new Board();
        b2.LoadFen(fen1);
        var p2 = b2.Squares[4, 6];
        p2.Move(b2, new Location(4, 4));
        
        Console.WriteLine($"After e5: {b2.ToFen()}");

        // Move 3: Nf3
        var fen2 = b2.ToFen();
        var b3 = new Board();
        b3.LoadFen(fen2);
        var p3 = b3.Squares[6, 0];
        bool isValid = p3.Move(b3, new Location(5, 2));
        
        Console.WriteLine($"Nf3 valid? {isValid}");
        Console.WriteLine($"After Nf3: {b3.ToFen()}");
    }
}
