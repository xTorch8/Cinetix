using System.ComponentModel.DataAnnotations;

namespace Cinetix.Models
{
    public class Movies
    {
        [Key] public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Genre { get; set; }

        [Required]
        public DateTime ReleaseDate { get; set; }

        [Required]
        public string Director { get; set; }

        [Required]
        public TimeSpan Duration { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Poster { get; set; }

        [Required]
        public string Trailer { get; set; }
    }
}
