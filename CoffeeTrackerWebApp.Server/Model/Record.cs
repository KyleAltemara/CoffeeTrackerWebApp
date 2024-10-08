namespace CoffeeTrackerWebApp.Server.Model;

public class Record
{
    public int Id { get; set; }
    public required string Description { get; set; }
    public int Ounces { get; set; }
    public string? Notes { get; set; }
    public DateTime Date { get; set; }
    public int Rating { get; set; }
}
