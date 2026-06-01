using System;
using System.Collections.Generic;
using Checkiski.Domain.ValueObjects;
using Checkiski.Domain.Enums;

namespace Checkiski.Domain.Entities
{
    public class Game
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid? WhitePlayerId { get; set; }
        public Player? WhitePlayer { get; set; }
        
        public Guid? BlackPlayerId { get; set; }
        public Player? BlackPlayer { get; set; }

        public Guid? DrawOfferedByPlayerId { get; set; }

        public string Pgn { get; set; } = string.Empty;
        public string CurrentFen { get; set; } = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        
        public GameOptions Options { get; set; } = null!;
        public TimeSpan WhiteClockRemaining { get; set; }
        public TimeSpan BlackClockRemaining { get; set; }
        public Color CurrentTurn { get; set; } = Color.White;
        public List<string> MoveList { get; set; } = new();
        
        public GameStatus Status { get; set; } = GameStatus.WaitingForOpponent;
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? EndedAt { get; set; }
        public DateTime? LastMoveAt { get; set; }
    }

    public enum GameStatus
    {
        InProgress,
        WhiteWon,
        BlackWon,
        Draw,
        Aborted,
        WaitingForOpponent
    }
}
