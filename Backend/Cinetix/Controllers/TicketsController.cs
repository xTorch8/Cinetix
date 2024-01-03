using Cinetix.Data;
using Cinetix.Models;
using Cinetix.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Sockets;
using Cinetix.DTO.Movies;
using Cinetix.DTO.Tickets;

namespace Cinetix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class TicketsController : ControllerBase
    {

        private readonly AppDbContext _context;

        public TicketsController(AppDbContext context)
        {
            _context = context;
        }


        // GetTicketsShowtime
        //  Logic and API for retrieving tickets based on showtime
        //
        //  Parameter:
        //   ShowtimeId
        //
        //  Returns:
        //   Process successful:
        //      HTTP Ok status with a JSON contains success status and tickets data
        //   Process failed:
        //      HTTP Ok status with a JSON contains contains failed status and error 
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Tickets/GetTickets
        [HttpGet("GetTicketsShowtime")]
        public async Task<IActionResult> GetTicketsShowtime(int showtimeId)
        {
            try
            {
                // showtimes
                //  Check whether showtimes is valid or not.
                var showtimes = await _context.Showtimes
                    .Where(s => s.Id == showtimeId)
                    .FirstOrDefaultAsync();

                if (showtimes == null)
                {
                    return Ok(new { success = false, error = "Showtimes not found" });
                }

                // tickets
                //  Check filled seat based on showtimeId
                var tickets = await _context.Tickets
                    .Where(u => u.ShowtimeId == showtimeId)
                    .ToListAsync();


                return Ok(new { success = true, tickets = tickets });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }


        // GetTicketsUser
        //  Logic and API for retrieving user's ticket data
        //  
        //  Parameter:
        //   Email
        //
        //  Returns:
        //   Process successful:
        //      HTTP Ok status with a JSON contains success status and tickets data 
        //   Process failed:
        //      HTTP Ok status with a JSON contains contains failed status and error 
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Tickets/GetTickets
        [HttpGet("GetTicketsUser")]
        public async Task<IActionResult> GetTicketsUser(string Email)
        {
            try
            {
                // user
                //  check whether use is valid or not
                var user = await _context.Users
                    .Where(u => u.Email == Email)
                    .FirstOrDefaultAsync();

                // user is not found
                if (user == null)
                {
                    return Ok(new { success = false, error = "User is not found" });
                }

                // ticketsList
                //   List contains ticket data in the database
                //   Because Ticket table have foreign key, join the tables first
                //   before retrieving the data
                var ticketsList = await (from tickets in _context.Tickets
                    join showtimes in _context.Showtimes on tickets.ShowtimeId equals showtimes.Id
                    join users in _context.Users on tickets.UserId equals users.Id
                    join theaters in _context.Theaters on showtimes.TheaterId equals theaters.Id

                    where users.Id == user.Id

                    let movie = _context.Movies
                        .Where(m => m.Id == showtimes.MovieId)
                        .FirstOrDefault()

                    let userEmail = users.Email
                    let theaterName = theaters.Name
                    let movieTitle = movie.Title
                    let movieDirector = movie.Director
                    let showtimeDate = showtimes.Date
                    let showtimeStartTime = showtimes.StartTime
                    let showtimeEndTime = showtimes.EndTime

                    orderby showtimeDate descending

                    select new
                    {
                        userEmail,
                        theaterName,
                        movieTitle,
                        movieDirector,
                        showtimeDate,
                        showtimeStartTime,
                        showtimeEndTime,
                        tickets.SeatNumber,
                    }

                ).ToListAsync();

                return Ok(new { success = true, tickets = ticketsList });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        // BuyTickets
        //  Logic and API for add buy tickets
        //  
        //  Parameter:
        //   DTOBuyTickets:
        //      UserEmail, TheaterName, MovieTitle, MovieDirector, Date, StartTime, SeatNumber
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
        //      Tickets/BuyTicket

        [HttpPost("BuyTicket")]
        public async Task<IActionResult> BuyTicket([FromBody] DTOBuyTickets tickets)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { error = "Model state is not valid" });
                }

                // user
                //  Check whether the user is exist or not
                var user = await _context.Users
                    .Where(u => u.Email == tickets.UserEmail)
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return Ok(new { success = false, error = "User is not found" });
                }

                // theater
                //  Check whether the theater valid or not
                var theater = await _context.Theaters
                    .Where(t => t.Name == tickets.TheaterName)
                    .FirstOrDefaultAsync();

                if (theater == null)
                {
                    return Ok(new { success = false, error = "Theater is not found" });
                }

                // movie
                //  Check whether the movie is valid or not
                var movie = await _context.Movies
                    .Where(m => m.Title == tickets.MovieTitle && m.Director == tickets.MovieDirector)
                    .FirstOrDefaultAsync();

                if (movie == null)
                {
                    return Ok(new { success = false, error = "Movie is not found" });
                }

                // Showtimes
                //  Check whether the showtimes exist or not
                var showtimes = await _context.Showtimes
                    .Where(s =>
                        s.TheaterId == theater.Id &&
                        s.MovieId == movie.Id &&
                        s.Date == tickets.Date &&
                        s.StartTime == tickets.StartTime &&
                        s.EndTime == tickets.StartTime + movie.Duration
                    )
                    .FirstOrDefaultAsync();

                if (showtimes == null)
                {
                    return Ok(new { success = false, error = "Showtime is not found" });
                }

                // Check whether the seat number is valid or not
                if (tickets.SeatNumber > theater.Capacity && tickets.SeatNumber < 0)
                {
                    return Ok(new { success = false, error = "Invalid seat number" });
                }

                // seat
                //  Check whether the seat number is already occupied or not
                var seat = await _context.Tickets
                    .Where(t => t.ShowtimeId == showtimes.Id && t.SeatNumber == tickets.SeatNumber)
                    .FirstOrDefaultAsync();

                if (seat != null)
                {
                    return Ok(new { success = false, error = "Seat is occupied" });
                }

                // Check whether user balance is enough for buying ticket or not
                if (user.Balance < showtimes.TicketPrice)
                {
                    return Ok(new { success = false, error = "Balace is insufficient" });
                }

                // ticket
                //  Object contains new ticket information
                var newTicket = new Tickets
                {
                    UserId = user.Id,
                    ShowtimeId = showtimes.Id,
                    SeatNumber = tickets.SeatNumber
                };

                // Reduce the user balance based on ticket price
                user.Balance = user.Balance - showtimes.TicketPrice;
                _context.Tickets.Add(newTicket);
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

    }
}