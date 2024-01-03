using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cinetix.Models
{
    public class Showtimes
    {
        [Key] 
        public int Id { get; set; }

        [ForeignKey("Movies")] 
        public int MovieId { get; set; }

        [ForeignKey("Theaters")] 
        public int TheaterId { get; set; }

        [Required] 
        public DateTime Date { get; set; }

        [Required] 
        public TimeSpan StartTime { get; set; }

        [Required] 
        public TimeSpan EndTime { get; set; }

        [Required]
        public decimal TicketPrice { get; set; } 
    }
}