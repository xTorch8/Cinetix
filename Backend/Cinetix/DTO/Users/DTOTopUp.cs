using System.ComponentModel.DataAnnotations;

namespace Cinetix.DTO.Users
{
    public class DTOTopUp
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public decimal Amount { get; set; }
    }
}
