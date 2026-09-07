using CatFacts.Api.Models;

namespace CatFacts.Api.Interfaces;

/// <summary>
/// Abstraction for the external data provider.
/// Allows for easy mocking during Unit Testing (e.g., using Moq) without making actual HTTP calls.
/// </summary>
public interface ICatFactProvider
{
    Task<CatFactResponse?> GetRandomFactAsync(CancellationToken cancellationToken = default);
}