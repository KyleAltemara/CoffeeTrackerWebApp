using Microsoft.EntityFrameworkCore;
using CoffeeTrackerWebApp.Server.Data;
using CoffeeTrackerWebApp.Server.Endpoints;

namespace CoffeeTrackerWebApp.Server;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddDbContext<CoffeeTrackerWebAppContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("CoffeeTrackerWebAppContext") ?? throw new InvalidOperationException("Connection string 'CoffeeTrackerWebAppContext' not found.")));

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        app.UseDefaultFiles();
        app.UseStaticFiles();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.MapFallbackToFile("/index.html");

        app.MapRecordEndpoints();

        app.Run();
    }
}
