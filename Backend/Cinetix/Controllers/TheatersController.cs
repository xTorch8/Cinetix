using Cinetix.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cinetix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TheatersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TheatersController(AppDbContext context)
        {
            _context = context;
        }

        // GetTheaters
        //  Logic and API for retrieving theaters data
        //  
        //  Parameter:
        //  -
        //
        //  Returns:
        //   Process successful:
        //      HTTP Ok status with a JSON contains success status and theaters data 
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //   Theaters/GetTheaters
        [HttpGet("GetTheaters")]
        public async Task<IActionResult> GetTheaters()
        {
            try
            {
                var theaters = await _context.Theaters.ToListAsync();
                return Ok(new { success = true, theaters = theaters });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
    }
}
