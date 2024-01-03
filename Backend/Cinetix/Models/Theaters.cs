using System.ComponentModel.DataAnnotations;

namespace Cinetix.Models
{
    public class Theaters
    {
        [Key] 
        public int Id { get; set; }

        [Required] 
        public string Name { get; set; }

        [Required] 
        public string Location { get; set; }

        [Required]
        public int Capacity { get; set; }

    }
}