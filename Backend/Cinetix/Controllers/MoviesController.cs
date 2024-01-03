using Cinetix.Data;
using Cinetix.DTO;
using Cinetix.DTO.Movies;
using Cinetix.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cinetix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MoviesController(AppDbContext context)
        {
            _context = context;
        }

        // GetMovie
        //  Logic and API for retrieving movies data
        //  
        //  Parameter:
        //      -
        //
        //  Returns:
        //   Process successful:
        //      HTTP Ok status with a JSON contains success status and movies data
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Movies/GetMovies 
        [HttpGet("GetMovies")]
        public async Task<IActionResult> GetMovies() {
            try
            {
                // moviesList
                //  List contains all the movies from the database
                var moviesList = await _context.Movies
                    .ToListAsync();

                return Ok(new {success = true, movies = moviesList});
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }


        [HttpPost("AddMovie")]
        // AddMovie
        //  Logic and API for add movie process
        //  
        //  Parameter:
        //   DTOAddMovie:
        //      UserEmail, Title, Genre, ReleaseDate, Director, Duration, Description, Poster, Trailer
        //
        //  Returns:
        //   Add movie successful:
        //      HTTP Ok status with a JSON contains success status
        //   Add movie failed:
        //      HTTP Ok status with a JSON contains failed status and error
        //   Model state invalid:
        //      HTTP BadRequest status
        //   Not admin:
        //      HTTP Unauthorized status
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Movies/AddMovie        
        public async Task<IActionResult> AddMovie([FromBody] DTOAddMovie movie)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { error = "Model state is not valid" });
                }

                // userRole
                //  Check whether the user have admin role or not
                var userRole = await _context.Users
                    .Where(u => u.Email == movie.UserEmail)
                    .FirstOrDefaultAsync();

                // The user doen't exist or doesn't have admin role
                if (userRole == null || !userRole.IsAdmin)
                {
                    return Unauthorized(new {error = "You are not authorized"});
                }

                // movies
                //  Check whether the movie has already exist on the database or not
                var movies = await _context.Movies
                    .Where(m => m.Title == movie.Title && m.Director == movie.Director)
                    .FirstOrDefaultAsync();

                // Add movie process successful
                if (movies == null)
                {
                    // newMovies
                    //  Object contains new movie information
                    var newMovie = new Movies
                    {
                        Title       = movie.Title,
                        Genre       = movie.Genre,
                        ReleaseDate = movie.ReleaseDate,
                        Director    = movie.Director,
                        Duration    = movie.Duration,
                        Description = movie.Description,
                        Poster      = movie.Poster,
                        Trailer     = movie.Trailer
                    };

                    await _context.Movies.AddAsync(newMovie);
                    await _context.SaveChangesAsync();

                    return Ok(new { success = true });
                }

                // Movie has already exist on the database
                return Ok(new {success = false, error = "Movie already exist"});
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpPut("EditMovie")]
        // EditMovie
        //  Logic and API for edit movie process
        //  
        //  Parameter:
        //   DTOEditMovie:
        //      UserEmail, Id, Title, Genre, ReleaseDate, Director, Duration, Description, Poster, Trailer
        //
        //  Returns:
        //   Add movie successful:
        //      HTTP Ok status with a JSON contains success status
        //   Add movie failed:
        //      HTTP Ok status with a JSON contains failed status and error
        //   Model state invalid:
        //      HTTP BadRequest status
        //   Not admin:
        //      HTTP Unauthorized status
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Movies/EditMovie        
        public async Task<IActionResult> EditMovie([FromBody] DTOEditMovie movie)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { error = "Model state is not valid" });
                }

                // userRole
                //  Check whether the user have admin role or not
                var userRole = await _context.Users
                    .Where(u => u.Email == movie.UserEmail)
                    .FirstOrDefaultAsync();

                // The user doen't exist or doesn't have admin role
                if (userRole == null || !userRole.IsAdmin)
                {
                    return Unauthorized(new { error = "You are not authorized" });
                }

                // movies
                //  Check whether the movie has already exist on the database or not
                var movies = await _context.Movies
                    .Where(m => m.Id == movie.Id)
                    .FirstOrDefaultAsync();

                // Edit movie process successful
                if (movies != null)
                {
                    movies.Title = movie.Title;
                    movies.Genre = movie.Genre;
                    movies.ReleaseDate = movie.ReleaseDate;
                    movies.Director = movie.Director;
                    movies.Duration = movie.Duration;
                    movies.Description = movie.Description;
                    movies.Poster = movie.Poster;
                    movies.Trailer = movie.Trailer;

                    await _context.SaveChangesAsync();
                    return Ok(new { success = true });
                }

                // Movie is not exist on the database
                return Ok(new { success = false, error = "Movie is not exist" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }


        [HttpDelete("DeleteMovie")]
        // DeleteMovie
        //  Logic and API for delete movie process
        //  
        //  Parameter:
        //   DTODeleteMovie:
        //      UserEmail, Id
        //
        //  Returns:
        //   Add movie successful:
        //      HTTP Ok status with a JSON contains success status
        //   Add movie failed:
        //      HTTP Ok status with a JSON contains failed status and error
        //   Model state invalid:
        //      HTTP BadRequest status
        //   Not admin:
        //      HTTP Unauthorized status
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Movies/DeleteMovie        
        public async Task<IActionResult> DeleteMovie([FromBody] DTODeleteMovie movie)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { error = "Model state is not valid" });
                }

                // userRole
                //  Check whether the user have admin role or not
                var userRole = await _context.Users
                    .Where(u => u.Email == movie.UserEmail)
                    .FirstOrDefaultAsync();

                // The user doen't exist or doesn't have admin role
                if (userRole == null || !userRole.IsAdmin)
                {
                    return Unauthorized(new { error = "You are not authorized" });
                }

                // movies
                //  Check whether the movie has already exist on the database or not
                var movies = await _context.Movies
                    .Where(m => m.Id == movie.Id)
                    .FirstOrDefaultAsync();

                // Delete movie process successful
                if (movies != null)
                {
                    _context.Remove(movies);
                    await _context.SaveChangesAsync();
                    return Ok(new { success = true });
                }

                // Movie is not exist on the database
                return Ok(new { success = false, error = "Movie is not exist" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

    }
}
