namespace CatFacts.Api.Interfaces;

/// <summary>
/// Abstraction for file system operations.
/// Decouples the business logic from direct file I/O, making the system easier to test and extend.
/// </summary>
public interface IFileStorage
{
    Task AppendFactAsync(string fact, CancellationToken cancellationToken = default);
}