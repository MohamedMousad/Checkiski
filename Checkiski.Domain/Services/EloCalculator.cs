using System;

namespace Checkiski.Domain.Services;

public class EloCalculator
{
    private const int KFactor = 32;

    public static (int NewRatingA, int NewRatingB) CalculateNewRatings(int ratingA, int ratingB, double scoreA)
    {
        double expectedA = 1.0 / (1.0 + Math.Pow(10, (ratingB - ratingA) / 400.0));
        double expectedB = 1.0 / (1.0 + Math.Pow(10, (ratingA - ratingB) / 400.0));

        double scoreB = 1.0 - scoreA;

        int newRatingA = (int)Math.Round(ratingA + KFactor * (scoreA - expectedA));
        int newRatingB = (int)Math.Round(ratingB + KFactor * (scoreB - expectedB));

        return (newRatingA, newRatingB);
    }
}
