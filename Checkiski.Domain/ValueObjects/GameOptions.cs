using Checkiski.Domain.Entities;
using Checkiski.Domain.Enums;

namespace Checkiski.Domain.ValueObjects;

public class GameOptions
{
    public Color ColorChoice { get; init; }
    public bool Rated { get; init; }
    public TimeControl TimeControl { get; init; } = new TimeControl();
    public GameCategory GameCategory { get; init; }

    public GameOptions() { }
    public GameOptions(Color colorChoice, bool rated, TimeControl timeControl, GameCategory gameCategory)
    {
        ColorChoice = colorChoice;
        Rated = rated;
        TimeControl = timeControl;
        GameCategory = gameCategory;
    }
}
