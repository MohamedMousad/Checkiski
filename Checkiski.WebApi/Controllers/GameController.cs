using Checkiski.Application.Games.Commands.CreateGame;
using Checkiski.Application.Games.Commands.JoinGame;
using Checkiski.Application.Games.Commands.SubmitMove;
using Checkiski.Application.Games.Commands.ResignGame;
using Checkiski.Application.Games.Commands.OfferDraw;
using Checkiski.Application.Games.Queries.GetGame;
using Checkiski.Application.Games.Queries.ListGames;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Authorization;

namespace Checkiski.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GameController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateGameCommand command)
        {
            var gameId = await _mediator.Send(command);
            return Ok(new { GameId = gameId });
        }

        [HttpPost("join")]
        public async Task<IActionResult> Join([FromBody] JoinGameCommand command)
        {
            var success = await _mediator.Send(command);
            if (!success) return BadRequest("Could not join game.");
            return Ok();
        }

        [HttpPost("move")]
        public async Task<IActionResult> Move([FromBody] SubmitMoveCommand command)
        {
            var success = await _mediator.Send(command);
            if (!success) return BadRequest("Invalid move.");
            return Ok();
        }

        [HttpPost("resign")]
        public async Task<IActionResult> Resign([FromBody] ResignGameCommand command)
        {
            var success = await _mediator.Send(command);
            if (!success) return BadRequest("Could not resign.");
            return Ok();
        }

        [HttpPost("draw")]
        public async Task<IActionResult> Draw([FromBody] OfferDrawCommand command)
        {
            var success = await _mediator.Send(command);
            if (!success) return BadRequest("Could not offer draw.");
            return Ok();
        }

        [HttpPost("timeout")]
        public async Task<IActionResult> Timeout([FromBody] Checkiski.Application.Games.Commands.TimeoutGame.TimeoutGameCommand command)
        {
            var success = await _mediator.Send(command);
            if (!success) return BadRequest("Could not process timeout.");
            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(System.Guid id)
        {
            var game = await _mediator.Send(new GetGameQuery { GameId = id });
            if (game == null) return NotFound();
            return Ok(game);
        }

        [HttpGet]
        public async Task<IActionResult> List()
        {
            var games = await _mediator.Send(new ListGamesQuery());
            return Ok(games);
        }
    }
}
