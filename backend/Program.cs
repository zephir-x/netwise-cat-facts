using CatFacts.Api.Interfaces;
using CatFacts.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. CORS Configuration: Essential for decoupling Frontend (React) and Backend.
// Allows our local Vite development server to communicate with this API without being blocked by browser security policies.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 2. Dependency Injection (DI) Setup
// We register IFileStorage as a Singleton. This is critical because it contains the SemaphoreSlim.
// If it were Transient/Scoped, every request would get a NEW semaphore, entirely defeating the purpose of the lock.
builder.Services.AddSingleton<IFileStorage, LocalFileStorage>();

// We use Typed Clients for HttpClient. This is the modern, safe way to handle HTTP requests in .NET.
// It prevents socket exhaustion issues and allows centralized configuration (like setting the BaseAddress).
builder.Services.AddHttpClient<ICatFactProvider, CatFactProvider>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["CatFactApi:BaseUrl"]!);
});

var app = builder.Build();

app.UseCors("AllowFrontend");

// 3. REST Endpoint Configuration (Minimal API approach)
app.MapGet("/api/facts/random", async (
    ICatFactProvider catFactProvider, 
    IFileStorage fileStorage, 
    CancellationToken cancellationToken) =>
{
    // Step 1: Fetch the data
    var response = await catFactProvider.GetRandomFactAsync(cancellationToken);
    
    // Step 2: Validate the response
    if (response is null || string.IsNullOrWhiteSpace(response.Fact))
    {
        return Results.Problem("Failed to fetch cat fact from external API.");
    }

    // Step 3: Persist the data locally
    await fileStorage.AppendFactAsync(response.Fact, cancellationToken);

    // Step 4: Return success to the client
    return Results.Ok(response);
});

app.Run();