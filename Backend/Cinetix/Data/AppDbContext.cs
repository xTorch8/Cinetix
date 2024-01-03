using Cinetix.Models;
using Microsoft.EntityFrameworkCore;

namespace Cinetix.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Users> Users { get; set; }

        public DbSet<Theaters> Theaters { get; set; }

        public DbSet<Movies> Movies { get; set; }

        public DbSet<Showtimes> Showtimes { get; set; }

        public DbSet<Tickets> Tickets { get; set; }
    }
}
