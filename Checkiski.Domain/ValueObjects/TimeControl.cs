using System;

namespace Checkiski.Domain.ValueObjects;

public class TimeControl
{
    public int BaseMinutes { get; init; }
    public int IncrementSeconds { get; init; }

    public TimeControl() { }
    public TimeControl(int baseMinutes, int incrementSeconds)
    {
        BaseMinutes = baseMinutes;
        IncrementSeconds = incrementSeconds;
    }
    public static TimeControl Bullet1_0 => new(1, 0);
    public static TimeControl Bullet2_1 => new(2, 1);
    public static TimeControl Blitz3_0 => new(3, 0);
    public static TimeControl Blitz3_2 => new(3, 2);
    public static TimeControl Blitz5_0 => new(5, 0);
    public static TimeControl Rapid10_0 => new(10, 0);
    public static TimeControl Rapid15_10 => new(15, 10);
    public static TimeControl Classical30_0 => new(30, 0);
}
