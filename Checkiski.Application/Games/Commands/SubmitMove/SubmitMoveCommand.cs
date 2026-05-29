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

            var piece = board.Squares[request.FromX, request.FromY];
            if (piece is Empty || piece.Color != board.CurrentTurn) return false; // Invalid piece selected

            bool isValid = piece.Move(board, new Location(request.ToX, request.ToY), request.Promotion);
            if (!isValid) return false;

            // Clocks management
            // Very simplified: assuming 1 move = 1 second for now or no time deduction unless LastMoveAt is tracked
            // Actually, we need a LastMoveAt. For now, since Game doesn't have LastMoveAt, we just assume some time passed.
            // Let's add LastMoveAt to Game? I will do that via EF Migration.
            // For now, let's just update FEN.
            
            game.CurrentFen = board.ToFen();
            game.CurrentTurn = board.CurrentTurn;
            
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

            // Check for game end
            King opponentKing = null!;
            for (int i = 0; i < 8; i++)
            {
                for (int j = 0; j < 8; j++)
                {
                    if (board.Squares[i, j] is King k && k.Color == board.CurrentTurn) // Next player's king
                        opponentKing = k;
                }
            }

            if (opponentKing.IsMate(board))
            {
                game.Status = isWhiteTurn ? Checkiski.Domain.Entities.GameStatus.WhiteWon : Checkiski.Domain.Entities.GameStatus.BlackWon;
                game.EndedAt = DateTime.UtcNow;
            }
            else if (opponentKing.IsStalemate(board) || board.IsDraw())
            {
                game.Status = Checkiski.Domain.Entities.GameStatus.Draw;
                game.EndedAt = DateTime.UtcNow;
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
