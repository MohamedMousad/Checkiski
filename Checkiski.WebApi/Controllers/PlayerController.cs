using Checkiski.Application.Players.Commands.RegisterPlayer;
using Checkiski.Application.Players.Commands.LoginPlayer;
using Checkiski.Application.Players.Queries.GetPlayerProfile;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Checkiski.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayerController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PlayerController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterPlayerCommand command)
        {
            try
            {
                var response = await _mediator.Send(command);
                return Ok(response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginPlayerCommand command)
        {
            try
            {
                var response = await _mediator.Send(command);
                return Ok(response);
            }
            catch (System.Exception ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("profile/me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var profile = await _mediator.Send(new GetPlayerProfileQuery { PlayerId = System.Guid.Parse(userId) });
            if (profile == null) return NotFound();
            
            return Ok(new
            {
                profile.Id,
                profile.Username,
                profile.ProfilePictureUrl,
                profile.Bio,
                profile.Country,
                profile.Rating,
                profile.BulletRating,
                profile.BlitzRating,
                profile.RapidRating,
                profile.ClassicalRating,
                profile.CreatedAt
            });
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] Checkiski.Application.Players.Commands.UpdateProfile.UpdateProfileCommand command)
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();
                
                command.PlayerId = System.Guid.Parse(userId);
                var response = await _mediator.Send(command);
                return Ok(response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("profile/{id}")]
        public async Task<IActionResult> GetProfile(System.Guid id)
        {
            var profile = await _mediator.Send(new GetPlayerProfileQuery { PlayerId = id });
            if (profile == null) return NotFound();
            
            // To prevent sending PasswordHash back
            return Ok(new
            {
                profile.Id,
                profile.Username,
                profile.ProfilePictureUrl,
                profile.Bio,
                profile.Country,
                profile.Rating,
                profile.BulletRating,
                profile.BlitzRating,
                profile.RapidRating,
                profile.ClassicalRating,
                profile.CreatedAt
            });
        }

        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetLeaderboard([FromQuery] string? category)
        {
            var leaderboard = await _mediator.Send(new Checkiski.Application.Players.Queries.GetLeaderboard.GetLeaderboardQuery { Category = category });
            return Ok(leaderboard);
        }
    }
}
