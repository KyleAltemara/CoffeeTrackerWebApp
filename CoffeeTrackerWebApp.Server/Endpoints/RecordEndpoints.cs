using Microsoft.EntityFrameworkCore;
using CoffeeTrackerWebApp.Server.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using CoffeeTrackerWebApp.Server.Model;

namespace CoffeeTrackerWebApp.Server.Endpoints;

public static class RecordEndpoints
{
    public static void MapRecordEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/Record").WithTags(nameof(Record));

        group.MapGet("/", async (CoffeeTrackerWebAppContext db) =>
        {
            return await db.CoffeeRecords.ToListAsync();
        })
        .WithName("GetAllRecords")
        .WithOpenApi();

        group.MapGet("/{id}", async Task<Results<Ok<Record>, NotFound>> (int id, CoffeeTrackerWebAppContext db) =>
        {
            return await db.CoffeeRecords.AsNoTracking()
                .FirstOrDefaultAsync(model => model.Id == id)
                is Record model
                    ? TypedResults.Ok(model)
                    : TypedResults.NotFound();
        })
        .WithName("GetRecordById")
        .WithOpenApi();

        group.MapPut("/{id}", async Task<Results<Ok, NotFound>> (int id, Record @record, CoffeeTrackerWebAppContext db) =>
        {
            var affected = await db.CoffeeRecords
                .Where(model => model.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(m => m.Id, @record.Id)
                    .SetProperty(m => m.Description, @record.Description)
                    .SetProperty(m => m.Ounces, @record.Ounces)
                    .SetProperty(m => m.Notes, @record.Notes)
                    .SetProperty(m => m.Date, @record.Date)
                    .SetProperty(m => m.Rating, @record.Rating)
                    );
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("UpdateRecord")
        .WithOpenApi();

        group.MapPost("/", async (Record @record, CoffeeTrackerWebAppContext db) =>
        {
            db.CoffeeRecords.Add(@record);
            await db.SaveChangesAsync();
            return TypedResults.Created($"/api/Record/{@record.Id}", @record);
        })
        .WithName("CreateRecord")
        .WithOpenApi();

        group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (int id, CoffeeTrackerWebAppContext db) =>
        {
            var affected = await db.CoffeeRecords
                .Where(model => model.Id == id)
                .ExecuteDeleteAsync();
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("DeleteRecord")
        .WithOpenApi();
    }
}
