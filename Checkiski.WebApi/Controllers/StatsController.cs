using Checkiski.Application.Stats.Queries.GetSystemStats;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Checkiski.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public StatsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var stats = await _mediator.Send(new GetSystemStatsQuery());
            return Ok(stats);
        }
    }
}
