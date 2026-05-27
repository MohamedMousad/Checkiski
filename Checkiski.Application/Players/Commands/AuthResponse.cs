namespace Checkiski.Application.Players.Commands
{
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string PlayerId { get; set; } = string.Empty;
    }
}
