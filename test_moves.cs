using System;
using Checkiski.Domain.Entities;
using Checkiski.Domain.ValueObjects;

class Program
{
    static void Main()
    {
        var board = new Board();
        // Move 1: e4
        var p1 = board.Squares[4, 1];
        Console.WriteLine($"1. e4 valid? {p1.Move(board, new Location(4, 3))}");
        Console.WriteLine(board.ToFen());

        // Move 2: e5
        var p2 = board.Squares[4, 6];
        Console.WriteLine($"2. e5 valid? {p2.Move(board, new Location(4, 4))}");
        Console.WriteLine(board.ToFen());

        // Move 3: Nf3
        var p3 = board.Squares[6, 0];
        Console.WriteLine($"3. Nf3 valid? {p3.Move(board, new Location(5, 2))}");
        Console.WriteLine(board.ToFen());

        // Move 4: Nc6
        var p4 = board.Squares[1, 7];
        Console.WriteLine($"4. Nc6 valid? {p4.Move(board, new Location(2, 5))}");
        Console.WriteLine(board.ToFen());

        // What if we reload fen?
        var fen = board.ToFen();
        var newBoard = new Board();
        newBoard.LoadFen(fen);

        // Move 5: Bb5
        var p5 = newBoard.Squares[5, 0];
        Console.WriteLine($"5. Bb5 valid? {p5.Move(newBoard, new Location(1, 4))}");
        Console.WriteLine(newBoard.ToFen());
    }
}
