using CatFacts.Api.Interfaces;
using CatFacts.Api.Models;

namespace CatFacts.Api.Services;

/// <summary>
/// Service responsible for fetching data from the external CatFact API.
/// Utilizes the primary constructor (C# 12 feature) to inject the configured HttpClient.
/// </summary>
public class CatFactProvider(HttpClient httpClient) : ICatFactProvider
{
    public async Task<CatFactResponse?> GetRandomFactAsync(CancellationToken cancellationToken = default)
    {
        // Executes an asynchronous GET request and automatically deserializes the JSON response into our record
        return await httpClient.GetFromJsonAsync<CatFactResponse>("fact", cancellationToken);
    }
}