using System.ComponentModel.DataAnnotations;

namespace Cinetix.Models
{
    public class Users
    {
        [Key] public int Id { get; set; }

        [Required]
        public string FirstName { get; set; }

        public string? LastName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public byte[] Password { get; set; }

        [Required]
        public decimal Balance { get; set; }

        [Required]
        public bool IsAdmin { get; set; }
    }
}