using System;

namespace Checkiski.Application.Common.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(Guid userId, string username);
    }
}
