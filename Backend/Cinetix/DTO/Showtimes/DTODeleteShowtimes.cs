using System.ComponentModel.DataAnnotations;

namespace Cinetix.DTO.Showtimes
{
    public class DTODeleteShowtimes
    {
        [Required]
        public string UserEmail { get; set; }

        [Required]
        public int Id { get; set; }
    }
}
