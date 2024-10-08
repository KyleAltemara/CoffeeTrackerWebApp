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
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        // Add CORS policy
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin",
                builder => builder.WithOrigins("https://localhost:4200")
                                  .AllowAnyHeader()
                                  .AllowAnyMethod());
        });

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

        // Use CORS policy
        app.UseCors("AllowSpecificOrigin");

        app.UseAuthorization();

        app.MapControllers();

        app.MapFallbackToFile("/index.html");

        app.MapRecordEndpoints();

        app.Run();
    }
}
