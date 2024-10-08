using Microsoft.EntityFrameworkCore;
using CoffeeTrackerWebApp.Server.Model;

namespace CoffeeTrackerWebApp.Server.Data;

public class CoffeeTrackerWebAppContext(DbContextOptions<CoffeeTrackerWebAppContext> options) : DbContext(options)
{
    public DbSet<Record> CoffeeRecords { get; set; } = default!;
}
