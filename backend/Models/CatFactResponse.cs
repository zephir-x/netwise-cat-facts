using System.Text.Json.Serialization;

namespace CatFacts.Api.Models;

/// <summary>
/// Immutable record representing the exact JSON structure returned by the external API.
/// Using records is a modern C# practice for data transfer objects (DTOs) due to their built-in value equality.
/// </summary>
public record CatFactResponse(
    [property: JsonPropertyName("fact")] string Fact,
    [property: JsonPropertyName("length")] int Length
);