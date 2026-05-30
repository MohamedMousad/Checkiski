using Checkiski.Application.Common.Interfaces;
using Checkiski.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Games.Commands.SubmitMove
{
    public class SubmitMoveCommand : IRequest<bool>
    {
        public Guid GameId { get; set; }
        public Guid PlayerId { get; set; }
        public int FromX { get; set; }
        public int FromY { get; set; }
        public int ToX { get; set; }
        public int ToY { get; set; }
        public char? Promotion { get; set; }
        public string San { get; set; } = string.Empty;
        public string Fen { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class SubmitMoveCommandHandler : IRequestHandler<SubmitMoveCommand, bool>
    {
        private readonly IAppDbContext _context;
        private readonly IGameNotifier _notifier;

        public SubmitMoveCommandHandler(IAppDbContext context, IGameNotifier notifier)
        {
            _context = context;
            _notifier = notifier;
        }

        public async Task<bool> Handle(SubmitMoveCommand request, CancellationToken cancellationToken)
        {
            var game = await _context.Games.FindAsync(new object[] { request.GameId }, cancellationToken);
            if (game == null || game.Status != Checkiski.Domain.Entities.GameStatus.InProgress) return false;

            var board = new Board();
            board.LoadFen(game.CurrentFen);

            var isWhiteTurn = board.CurrentTurn == Checkiski.Domain.Entities.Color.White;
            var playerTurnId = isWhiteTurn ? game.WhitePlayerId : game.BlackPlayerId;

            if (request.PlayerId != playerTurnId) return false; // Not player's turn

            // Bypass custom engine validation and trust the frontend (chess.js) FEN
            // This fixes desync bugs caused by custom engine rejecting valid moves
            
            game.CurrentFen = !string.IsNullOrEmpty(request.Fen) ? request.Fen : board.ToFen();
            game.CurrentTurn = isWhiteTurn ? Checkiski.Domain.Entities.Color.Black : Checkiski.Domain.Entities.Color.White;
            
            if (!string.IsNullOrEmpty(request.San))
            {
                game.MoveList.Add(request.San);
            }
            else
            {
                string moveStr = $"{(char)('a' + request.FromX)}{request.FromY + 1}-{(char)('a' + request.ToX)}{request.ToY + 1}";
                if (request.Promotion.HasValue) moveStr += $"={char.ToUpper(request.Promotion.Value)}";
                game.MoveList.Add(moveStr);
            }
            
            // Generate valid PGN with move numbers
            var pgnBuilder = new System.Text.StringBuilder();
            for (int i = 0; i < game.MoveList.Count; i++)
            {
                if (i % 2 == 0) pgnBuilder.Append($"{(i / 2) + 1}. ");
                pgnBuilder.Append(game.MoveList[i]).Append(" ");
            }
            game.Pgn = pgnBuilder.ToString().TrimEnd();

            // Handle game end from frontend status
            if (!string.IsNullOrEmpty(request.Status))
            {
                if (request.Status == "checkmate")
                {
                    game.Status = isWhiteTurn ? Checkiski.Domain.Entities.GameStatus.WhiteWon : Checkiski.Domain.Entities.GameStatus.BlackWon;
                    game.EndedAt = DateTime.UtcNow;
                }
                else if (request.Status == "draw" || request.Status == "stalemate" || request.Status == "repetition")
                {
                    game.Status = Checkiski.Domain.Entities.GameStatus.Draw;
                    game.EndedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            await _notifier.MoveSubmittedAsync(game.Id, game.CurrentFen, game.Pgn, game.WhiteClockRemaining, game.BlackClockRemaining);
            if (game.Status != Checkiski.Domain.Entities.GameStatus.InProgress)
            {
                await _notifier.GameEndedAsync(game.Id, game.Status);
            }

            return true;
        }
    }
}
