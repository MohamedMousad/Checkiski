using System;
using Checkiski.Domain.Entities;

var board = new Board();
board.InitBoard();

// 1. e4
var p1 = board.Squares[4, 1];
p1.Move(board, new Location(4, 3));
var fen1 = board.ToFen();
Console.WriteLine($"FEN 1: {fen1}");

// Load FEN 1
var b2 = new Board();
b2.LoadFen(fen1);

// 1... e5
var p2 = b2.Squares[4, 6];
bool v2 = p2.Move(b2, new Location(4, 4));
var fen2 = b2.ToFen();
Console.WriteLine($"1... e5: {v2}, FEN: {fen2}");

// Load FEN 2
var b3 = new Board();
b3.LoadFen(fen2);

// 2. Nf3
var p3 = b3.Squares[6, 0];
bool v3 = p3.Move(b3, new Location(5, 2));
var fen3 = b3.ToFen();
Console.WriteLine($"2. Nf3: {v3}, FEN: {fen3}");

// Load FEN 3
var b4 = new Board();
b4.LoadFen(fen3);

// 2... Nc6
var p4 = b4.Squares[1, 7];
bool v4 = p4.Move(b4, new Location(2, 5));
Console.WriteLine($"2... Nc6: {v4}");
