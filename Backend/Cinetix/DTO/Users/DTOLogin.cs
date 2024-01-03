using System.ComponentModel.DataAnnotations;

namespace Cinetix.DTO
{
    public class DTOLogin
    {

        [Required]
        public string Email { get; set; }

        [Required] 
        public string Password { get; set; }
    }
}
