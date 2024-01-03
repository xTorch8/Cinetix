using System.ComponentModel.DataAnnotations;

namespace Cinetix.DTO.Users
{
    public class DTOForgotPassword
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string ConfirmPassword { get; set; }
    }
}
