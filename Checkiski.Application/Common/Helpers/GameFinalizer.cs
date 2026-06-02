using Checkiski.Application.Common.Interfaces;
using Checkiski.Domain.Entities;
using Checkiski.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Checkiski.Application.Common.Helpers
{
    public static class GameFinalizer
    {
        public static async Task FinalizeRatingsAsync(IAppDbContext context, Game game, CancellationToken cancellationToken)
        {
            if (game.Options == null || !game.Options.Rated) return;
            if (game.Status == GameStatus.InProgress || game.Status == GameStatus.Aborted || game.Status == GameStatus.WaitingForOpponent) return;
            if (!game.WhitePlayerId.HasValue || !game.BlackPlayerId.HasValue) return;

            var white = await context.Players.FindAsync(new object[] { game.WhitePlayerId.Value }, cancellationToken);
            var black = await context.Players.FindAsync(new object[] { game.BlackPlayerId.Value }, cancellationToken);

            if (white == null || black == null) return;

            int whiteRating = GetRating(white, game.Options.GameCategory);
            int blackRating = GetRating(black, game.Options.GameCategory);

            double expectedWhite = 1.0 / (1.0 + Math.Pow(10, (blackRating - whiteRating) / 400.0));
            double expectedBlack = 1.0 / (1.0 + Math.Pow(10, (whiteRating - blackRating) / 400.0));

            double actualWhite = game.Status == GameStatus.WhiteWon ? 1.0 : (game.Status == GameStatus.BlackWon ? 0.0 : 0.5);
            double actualBlack = game.Status == GameStatus.BlackWon ? 1.0 : (game.Status == GameStatus.WhiteWon ? 0.0 : 0.5);

            int k = 32;
            int newWhiteRating = whiteRating + (int)Math.Round(k * (actualWhite - expectedWhite));
            int newBlackRating = blackRating + (int)Math.Round(k * (actualBlack - expectedBlack));

            SetRating(white, game.Options.GameCategory, newWhiteRating);
            SetRating(black, game.Options.GameCategory, newBlackRating);
        }

        private static int GetRating(Player p, GameCategory cat) => cat switch
        {
            GameCategory.Bullet => p.BulletRating,
            GameCategory.Blitz => p.BlitzRating,
            GameCategory.Rapid => p.RapidRating,
            GameCategory.Classical => p.ClassicalRating,
            _ => p.Rating
        };

        private static void SetRating(Player p, GameCategory cat, int rating)
        {
            switch (cat)
            {
                case GameCategory.Bullet: p.BulletRating = rating; break;
                case GameCategory.Blitz: p.BlitzRating = rating; break;
                case GameCategory.Rapid: p.RapidRating = rating; break;
                case GameCategory.Classical: p.ClassicalRating = rating; break;
            }
        }
    }
}
