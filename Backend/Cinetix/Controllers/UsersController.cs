using Cinetix.Data;
using Cinetix.Models;
using Cinetix.Helper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Cinetix.DTO.Users;
using Cinetix.DTO;

namespace Cinetix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }
        // Login
        //  Logic and API for get user information.
        //  
        //  Parameter:
        //      Email
        //
        //  Returns:
        //   Login successful:
        //      HTTP Ok status with a JSON contains success status and user information
        //   Login failed:
        //      HTTP Ok status with a JSON contains failed status and error
        //   Model state invalid:
        //      HTTP BadRequest status
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Users/GetUserInformation
        [HttpGet("GetUserInformation")]
        public async Task<IActionResult> GetUserInformation(string email)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { error = "Model state is not valid" });
                }


                // users
                //  Check if there is a user with the same email and password
                var users = await _context.Users
                    .Where(u => u.Email == email)
                    .Select(u => new
                    {
                        u.FirstName,
                        u.LastName,
                        u.Email,
                        u.Balance,
                        u.IsAdmin
                    })
                    .FirstOrDefaultAsync();

                // Successful
                if (users != null)
                {
                    return Ok(new { success = true, userInformation = users });
                }

                // Failed
                return Ok(new { success = false, error = "Invalid email" });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }


        // Login
        //  Logic and API for user login process
        //  
        //  Parameter:
        //   DTOLogin:
        //      Email and Password
        //
        //  Returns:
        //   Login successful:
        //      HTTP Ok status with a JSON contains success status and user information
        //   Login failed:
        //      HTTP Ok status with a JSON contains failed status and error
        //   Model state invalid:
        //      HTTP BadRequest status
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Users/Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] DTOLogin user)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { error = "Model state is not valid" });
                }

                // hashedPassword
                //  Password that have been hashed using SHA_256 algorithm
                //  For more detail, check ComputeHash function in the Helper/Hashing.cs
                var hashedPassword = Hashing.ComputeHash(user.Password);

                // users
                //  Check if there is a user with the same email and password
                var users = await _context.Users
                    .Where(u => u.Email == user.Email && u.Password.SequenceEqual(hashedPassword))
                    .Select(u => new
                    {
                        u.FirstName,
                        u.LastName,
                        u.Email,
                        u.Balance,
                        u.IsAdmin
                    })
                    .FirstOrDefaultAsync();

                // Login successfull
                if (users != null) 
                { 
                    return Ok(new { success = true, userInformation = users });
                }

                // Login failed
                return Ok(new { success = false, error = "Invalid email and/or password" });
                
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        // Register
        //  Logic and API for user register process
        //  
        //  Parameter:
        //   DTORegister:
        //      FirstName, LastName (optional), Email, Password, ConfirmPassword
        //
        //  Returns:
        //   Login successful:
        //      HTTP Ok status with a JSON contains success status
        //   Login failed:
        //      HTTP Ok status with a JSON contains failed status and error
        //   Model state invalid:
        //      HTTP BadRequest status
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Users/Register
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] DTORegister user)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { error = "Model state is not valid" });
                }

                // users
                //  Check whether the email address is already registered
                var users = await _context.Users
                    .Where(u => u.Email == user.Email)
                    .FirstOrDefaultAsync();

                // Email hasn't registered yet
                if (users == null)
                {
                    // Password validation
                    if (user.Password.Length >= 8 && 
                        Regex.IsMatch(user.Password, @"\d") &&
                        Regex.IsMatch(user.Password, @"[A-Z]") &&
                        Regex.IsMatch(user.Password, @"[a-z]") &&
                        !Regex.IsMatch(user.Password, @"^([a-zA-Z0-9]+)$") &&
                        user.Password.Equals(user.ConfirmPassword)
                        )
                    {
                        // hashedPassword
                        //  Hashed the registered password using SHA_256 algorithm
                        //  For more detail, check ComputeHash function in the Helper/Hashing.cs
                        var hashedPassword = Hashing.ComputeHash(user.Password);

                        // newUsers
                        //  Object contains new registered user informations
                        //  By default, the balance account is 0
                        //  The status is not admin
                        var newUsers = new Users
                        {
                            FirstName   = user.FirstName,
                            LastName    = user.LastName,
                            Email       = user.Email,
                            Password    = hashedPassword,
                            Balance     = 0,
                            IsAdmin     = false,
                        };
                       
                        // Add the newUsers to the database and save the changes
                        await _context.Users.AddAsync(newUsers);
                        await _context.SaveChangesAsync();
                        return Ok(new { success = true });
                    }

                    // Password is not the same as ConfirmPassword
                    if (user.Password != user.ConfirmPassword)
                    {
                        return Ok(new { 
                            success = false, 
                            error   = "Password and confirm password must be the same" 
                        });
                    }
                    // Password doesn't have 8 digit and/or contains lowercase, uppercase, number, and symbol
                    return Ok(new { 
                        success = false, 
                        error   = "Password must have at least 8 digit and contains lowercase, uppercase, number, and symbol."
                    });

                }
                // Email has been registered before
                else
                {
                    return Ok(new { 
                        success = false, 
                        error = "Email already registered" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        // ForgotPassword
        //  Logic and API for user forgot password process
        //  
        //  Parameter:
        //   DTOForgotPassword:
        //      Email, Password, ConfirmPassword
        //
        //  Returns:
        //   Login successful:
        //      HTTP Ok status with a JSON contains success status
        //   Login failed:
        //      HTTP Ok status with a JSON contains failed status and error
        //   Model state invalid:
        //      HTTP BadRequest status
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Users/ForgotPassword
        [HttpPut("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] DTOForgotPassword user)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { error = "Model state is not valid" });
                }

                // users
                //  Check whether the email address is already registered
                var users = await _context.Users
                    .Where(u => u.Email == user.Email)
                    .FirstOrDefaultAsync();

                // Email hasn't registered yet
                if (users == null)
                {
                    return Ok(new { success = false, error = "Invalid email" });

                }
                // Email has been registered before
                else
                {
                    // Password validation
                    if (user.Password.Length >= 8 &&
                        Regex.IsMatch(user.Password, @"\d") &&
                        Regex.IsMatch(user.Password, @"[A-Z]") &&
                        Regex.IsMatch(user.Password, @"[a-z]") &&
                        !Regex.IsMatch(user.Password, @"^([a-zA-Z0-9]+)$") &&
                        user.Password.Equals(user.ConfirmPassword)
                        )
                    {
                        // hashedPassword
                        //  Hashed the new password using SHA_256 algorithm
                        //  For more detail, check ComputeHash function in the Helper/Hashing.cs
                        var hashedPassword = Hashing.ComputeHash(user.Password);


                        // Add the newUsers to the database and save the changes
                        users.Password = hashedPassword;
                        await _context.SaveChangesAsync();
                        return Ok(new { success = true });
                    }

                    // Password is not the same as confirm password
                    if (user.Password != user.ConfirmPassword)
                    {
                        return Ok(new
                        {
                            success = false,
                            error   = "Password and confirm password must be the same"
                        });
                    }
                    
                    // Password doesn't have 8 digit and/or contains lowercase, uppercase, number, and symbol
                    return Ok(new { 
                        success = false, 
                        error   = "Password must have at least 8 digit and contains lowercase, uppercase, number, and symbol." 
                    });
                }

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        // TopUp
        //  Logic and API for top up process
        //  
        //  Parameter:
        //   DTOTopUp:
        //      Email, Amount
        //
        //  Returns:
        //   Topup successful:
        //      HTTP Ok status with a JSON contains success status
        //   Topup failed:
        //      HTTP Ok status with a JSON contains failed status and error
        //   Model state invalid:
        //      HTTP BadRequest status
        //   Exception:
        //      HTTP 500 status code
        //
        //  API URL:
        //      Users/TopUp
        [HttpPut("TopUp")]
        public async Task<IActionResult> TopUp([FromBody] DTOTopUp user)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { error = "Model state is not valid" });
                }

                // users
                //  Check whether the user is valid or not
                var users = await _context.Users
                   .Where(u => u.Email == user.Email)
                   .FirstOrDefaultAsync();


                if (users == null)
                {
                    return Ok(new { success = false, error = "User is not found" });
                }

                // Check whether the amount to topup is valid or not
                if (user.Amount < 0)
                {
                    return Ok(new { success = false,  error = "Amount must be greater than 0" });
                }

                // Add the user balance based on the amount of topup
                users.Balance = users.Balance + user.Amount;
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
