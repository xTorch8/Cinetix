using System.ComponentModel.DataAnnotations;

namespace Cinetix.DTO.Showtimes
{
    public class DTOAddShowtimes
    {
        
        [Required]
        public string UserEmail { get; set; }

        [Required]
        public string MovieTitle { get; set; }

        [Required]
        public string MovieDirector { get; set; }
    
        [Required]
        public string TheaterName { get; set; }
 
        [Required]
        public DateTime Date { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public decimal TicketPrice { get; set; }
      
    }
}
