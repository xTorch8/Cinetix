using Cinetix.Data;
using Cinetix.DTO.Showtimes;
using Cinetix.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cinetix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShowtimesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ShowtimesController(AppDbContext context)
        {
            _context = context;
        }

        // GetShowtimes
        //  Logic and API for retrieving showtimes data
        //  
        //  Parameter:
        //   -
        //  Returns:
        //   Process successful:
        //      HTTP Ok status with a JSON contains success status and showtimes data 
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Showtimes/GetShowtimes
        [HttpGet("GetShowtimes")]
        public async Task<IActionResult> GetShowtimes()
        {
            try
            {
                // showtimesList
                //   List contains showtimes data in the database
                //   Because Showtimes table have foreign key, join the tables first
                //   before retrieving the data
                var showtimesList = await (from showtimes in  _context.Showtimes
                    join movies in _context.Movies on showtimes.MovieId equals movies.Id
                    join theaters in _context.Theaters on showtimes.TheaterId equals theaters.Id

                    let theaterName         = theaters.Name
                    let theaterLocation     = theaters.Location
                    let moviesTitle         = movies.Title
                    let moviesReleaseDate   = movies.ReleaseDate
                    let moviesDirector      = movies.Director
                    let moviesDuration      = movies.Duration
                    let moviesDescription   = movies.Description
                    let moviesPoster        = movies.Poster
                    let movieTrailer        = movies.Trailer

                    where showtimes.Date.Date >= DateTime.Now.Date
                    select new
                    {
                        showtimes.Id,
                        theaterName,
                        theaterLocation,
                        moviesTitle,
                        moviesReleaseDate,
                        moviesDirector,
                        moviesDuration,
                        moviesDescription,
                        moviesPoster,
                        movieTrailer,
                        showtimes.Date,
                        showtimes.StartTime,
                        showtimes.EndTime,
                        showtimes.TicketPrice
                    }
                 
                )
                .OrderBy(showtime => showtime.Date)
                .ThenBy(showtime => showtime.theaterName)
                .ThenBy(showtime => showtime.StartTime)
                .ThenBy(showtime => showtime.moviesTitle)
                .ToListAsync();

                return Ok(new { success = true, showtimes = showtimesList });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        // AddShowtimes
        //  Logic and API for add showtimes data
        //  
        //  Parameter:
        //   DTOAddShowtimes:
        //      UserEmail, MovieTitle, MovieDirector, TheaterName, Date, StartTime, TicketPrice
        //
        //  Returns:
        //   Process successful:
        //      HTTP Ok status with a JSON contains success status
        //   Process failed:
        //      HTTP Ok status with a JSON contains failed status and error
        //   Model state invalid:
        //      BadRequest status code
        //   Not admin:
        //      HTTP Unauthorized status
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Showtimes/AddShowtimes
        [HttpPost("AddShowtimes")]
        public async Task<IActionResult> AddShowtimes([FromBody] DTOAddShowtimes showtimes)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { error = "Model state is not valud" });
                }

                // userRole
                //  Check whether the user have admin role or not
                var userRole = await _context.Users
                    .Where(u => u.Email == showtimes.UserEmail)
                    .FirstOrDefaultAsync();

                if (userRole == null || !userRole.IsAdmin)
                {
                    return Unauthorized(new { error = "You are not authorized" });
                } 


                // theater
                //  Check whether TheaterName is valid or not
                var theater = await _context.Theaters
                    .Where(t => t.Name == showtimes.TheaterName)
                    .FirstOrDefaultAsync();

                // TheaterName is not valid
                if (theater == null)
                {
                    return Ok(new { success = false, error = "Theater is not found" });
                }

                // movie
                //  Check whether movie is valid or not.
                var movie = await _context.Movies
                    .Where(m => m.Title == showtimes.MovieTitle && m.Director == showtimes.MovieDirector)
                    .FirstOrDefaultAsync();

                if (movie == null)
                {
                    return Ok(new { success = false, error = "Movie is not found" });
                }

                // checkShowtimes
                //  Check whether StartTime and EndTime is conflict with existing schedule or not
                var showtimesEndTime = showtimes.StartTime + movie.Duration;

                var checkShowtimes = await _context.Showtimes
                    .Where(s => s.TheaterId == theater.Id && s.Date == showtimes.Date &&
                     ((s.StartTime <= showtimes.StartTime && s.EndTime > showtimes.StartTime) ||
                     (s.StartTime < showtimesEndTime && s.EndTime >= showtimesEndTime) ||
                     (s.StartTime >= showtimes.StartTime && s.EndTime <= showtimesEndTime)))
                    .FirstOrDefaultAsync();

                if (checkShowtimes != null)
                {
                    return Ok(new { success = false, error = "Time overlapping" });
                }

                // newShowtimes
                //  Object contains new showtimes informations
                var newShowtimes = new Showtimes
                {
                    MovieId = movie.Id,
                    TheaterId = theater.Id,
                    Date = showtimes.Date,
                    StartTime = showtimes.StartTime,
                    EndTime = showtimesEndTime,
                    TicketPrice = showtimes.TicketPrice
                };

                await _context.Showtimes.AddAsync(newShowtimes);
                await _context.SaveChangesAsync();
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        // EditShowtimes
        //  Logic and API for edit showtimes data
        //  
        //  Parameter:
        //   DTOEditShowtimes:
        //      UserEmail, Id, MovieTitle, MovieDirector, MovieDuration, TheaterName, Date, StartTime, TicketPrice
        //
        //  Returns:
        //   Process successful:
        //      HTTP Ok status with a JSON contains success status
        //   Process failed:
        //      HTTP Ok status with a JSON contains failed status and error
        //   Model state invalid:
        //      BadRequest status code
        //   Not admin:
        //      HTTP Unauthorized status
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Showtimes/EditShowtimes
        [HttpPut("EditShowtimes")]
        public async Task<IActionResult> EditShowtimes([FromBody] DTOEditShowtimes showtimes)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { error = "Model state is not valud" });
                }

                // userRole
                //  Check whether the user have admin role or not
                var userRole = await _context.Users
                    .Where(u => u.Email == showtimes.UserEmail)
                    .FirstOrDefaultAsync();

                if (userRole == null || !userRole.IsAdmin)
                {
                    return Unauthorized(new { error = "You are not authorized" });
                }

                // checkShowtimesId
                //  check whether showtimes is valid or not
                var checkShowtimesId = await _context.Showtimes
                    .Where(s => s.Id == showtimes.Id)
                    .FirstOrDefaultAsync();

                if (checkShowtimesId == null)
                {
                    return Ok(new { success = false, error = "Showtimes is not found" });
                }


                // theater
                //  Check whether TheaterName is valid or not
                var theater = await _context.Theaters
                    .Where(t => t.Name == showtimes.TheaterName)
                    .FirstOrDefaultAsync();

                // TheaterName is not valid
                if (theater == null)
                {
                    return Ok(new { success = false, error = "Theater is not found" });
                }

                // movie
                //  Check whether movie is valid or not.
                var movie = await _context.Movies
                    .Where(m => m.Title == showtimes.MovieTitle && m.Director == showtimes.MovieDirector)
                    .FirstOrDefaultAsync();

                if (movie == null)
                {
                    return Ok(new { success = false, error = "Movie is not found" });
                }

                // checkShowtimes
                //  Check whether StartTime and EndTime is conflict with existing schedule or not
                var showtimesEndTime = showtimes.StartTime + movie.Duration;

                var checkShowtimes = await _context.Showtimes
                    .Where(s => s.Id != showtimes.Id && s.TheaterId == theater.Id && s.Date == showtimes.Date &&
                     ((s.StartTime <= showtimes.StartTime && s.EndTime > showtimes.StartTime) ||
                     (s.StartTime < showtimesEndTime && s.EndTime >= showtimesEndTime) ||
                     (s.StartTime >= showtimes.StartTime && s.EndTime <= showtimesEndTime)))
                    .FirstOrDefaultAsync();

                if (checkShowtimes != null)
                {
                    return Ok(new { success = false, error = "Time conflicted" });
                }


                checkShowtimesId.MovieId        = movie.Id;
                checkShowtimesId.TheaterId      = theater.Id;
                checkShowtimesId.Date           = showtimes.Date;
                checkShowtimesId.StartTime      = showtimes.StartTime;
                checkShowtimesId.EndTime        = showtimesEndTime;
                checkShowtimesId.TicketPrice    = showtimes.TicketPrice;
                await _context.SaveChangesAsync();
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        // DeleteShowtimes
        //  Logic and API for delete showtimes data
        //  
        //  Parameter:
        //   DTODeleteShowtimes:
        //      UserEmail, Id
        //
        //  Returns:
        //   Process successful:
        //      HTTP Ok status with a JSON contains success status
        //   Process failed:
        //      HTTP Ok status with a JSON contains failed status and error
        //   Model state invalid:
        //      BadRequest status code
        //   Not admin:
        //      HTTP Unauthorized status
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Showtimes/DeleteShowtimes
        [HttpDelete("DeleteShowtimes")]
        public async Task<IActionResult> DeleteShowtimes([FromBody] DTODeleteShowtimes showtimes)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { error = "Model state is not valud" });
                }

                // userRole
                //  Check whether the user have admin role or not
                var userRole = await _context.Users
                    .Where(u => u.Email == showtimes.UserEmail)
                    .FirstOrDefaultAsync();

                if (userRole == null || !userRole.IsAdmin)
                {
                    return Unauthorized(new { error = "You are not authorized" });
                }
                
                // checkShowtimes
                //  check whether the showtimes is exist or not
                var checkShowtimes = await _context.Showtimes
                    .Where(s => s.Id == showtimes.Id)
                    .FirstOrDefaultAsync();

                // showtimes is not exist
                if (checkShowtimes == null)
                {
                    return Ok(new { success = false, error = "Delete error" });
                }

                // showtimes exist and delete it from the database
                _context.Remove(checkShowtimes);
                await _context.SaveChangesAsync();
                return Ok(new { success = true });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

    }
}
