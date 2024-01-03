using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cinetix.Models
{
    public class Tickets
    {
        [Key] 
        public int Id { get; set; }

        [ForeignKey("Users")] 
        public int UserId { get; set; }

        [ForeignKey("Showtimes")] 
        public int ShowtimeId { get; set; }

        [Required] 
        public int SeatNumber { get; set; }
    }
}