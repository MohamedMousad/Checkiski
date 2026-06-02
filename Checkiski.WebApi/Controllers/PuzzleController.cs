using Checkiski.Domain.Entities;
using Checkiski.Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Checkiski.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PuzzleController : ControllerBase
    {
        private readonly IAppDbContext _context;

        public PuzzleController(IAppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetPuzzles([FromQuery] int rating = 1200)
        {
            var puzzles = _context.Puzzles.ToList();
            if (!puzzles.Any()) return Ok(new List<Puzzle>());

            // Return puzzles ordered by closest rating match
            var sorted = puzzles.OrderBy(p => Math.Abs(p.Rating - rating)).Take(5).ToList();
            return Ok(sorted);
        }
    }
}
