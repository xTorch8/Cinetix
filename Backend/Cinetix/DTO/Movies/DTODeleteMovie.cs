using System.ComponentModel.DataAnnotations;

namespace Cinetix.DTO.Movies
{
    public class DTODeleteMovie
    {
        [Required]
        public string UserEmail { get; set; }

        [Required]
        public int Id { get; set; }
    }
}
