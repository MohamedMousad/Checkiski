using Checkiski.Application.Players.Commands.RegisterPlayer;
using Checkiski.Application.Players.Commands.LoginPlayer;
using Checkiski.Application.Players.Queries.GetPlayerProfile;
using Checkiski.Application.Common.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Checkiski.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayerController : ControllerBase
    {
        private readonly IMediator _mediator;

        private readonly IImageUploadService _imageUploadService;

        public PlayerController(IMediator mediator, IImageUploadService imageUploadService)
        {
            _mediator = mediator;
            _imageUploadService = imageUploadService;
        }

        [HttpPost("upload-profile-picture")]
        [Authorize]
        public async Task<IActionResult> UploadProfilePicture(IFormFile file)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (file == null || file.Length == 0) return BadRequest("File is empty");

            using var stream = file.OpenReadStream();
            var uploadedUrl = await _imageUploadService.UploadImageAsync(stream, file.FileName);
            
            if (string.IsNullOrEmpty(uploadedUrl)) return BadRequest("Could not upload image to Cloudinary.");

            var success = await _mediator.Send(new Checkiski.Application.Players.Commands.UpdateProfilePicture.UpdateProfilePictureCommand
            {
                PlayerId = userId,
                ProfilePictureUrl = uploadedUrl
            });

            if (!success) return BadRequest("Could not update profile picture.");
            return Ok(new { Url = uploadedUrl });
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

        [HttpGet("profile/{id}/history")]
        public async Task<IActionResult> GetProfileHistory(System.Guid id)
        {
            var history = await _mediator.Send(new Checkiski.Application.Players.Queries.GetPlayerGameHistory.GetPlayerGameHistoryQuery { PlayerId = id });
            return Ok(history);
        }

        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetLeaderboard([FromQuery] string? category)
        {
            var leaderboard = await _mediator.Send(new Checkiski.Application.Players.Queries.GetLeaderboard.GetLeaderboardQuery { Category = category });
            return Ok(leaderboard);
        }
    }
}
