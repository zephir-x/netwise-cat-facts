using CatFacts.Api.Interfaces;

namespace CatFacts.Api.Services;

/// <summary>
/// Handles local file operations with thread safety.
/// </summary>
public class LocalFileStorage(IConfiguration configuration) : IFileStorage
{
    // SemaphoreSlim is crucial here. In a Web API, multiple concurrent HTTP requests might try to write 
    // to the same text file simultaneously, leading to an IOException (file in use).
    // This lock ensures only one thread can write to the file at any given millisecond.
    private static readonly SemaphoreSlim Semaphore = new(1, 1);
    
    // Retrieves the file path from appsettings.json, falling back to a default name if missing.
    private readonly string _filePath = configuration["Storage:LocalFilePath"] ?? "facts.txt";

    public async Task AppendFactAsync(string fact, CancellationToken cancellationToken = default)
    {
        // Wait asynchronously until the thread can enter the critical section
        await Semaphore.WaitAsync(cancellationToken);
        try
        {
            await File.AppendAllTextAsync(_filePath, $"{fact}{Environment.NewLine}", cancellationToken);
        }
        finally
        {
            // Always release the semaphore in a finally block to prevent deadlocks if an exception occurs
            Semaphore.Release();
        }
    }
}