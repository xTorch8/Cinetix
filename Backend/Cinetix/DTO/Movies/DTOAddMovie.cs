using System.ComponentModel.DataAnnotations;

namespace Cinetix.DTO.Movies
{
    public class DTOAddMovie
    {
        [Required]
        public string UserEmail {  get; set; }

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
