namespace CatFacts.Api.Interfaces;

/// <summary>
/// Abstraction for cloud backup operations.
/// </summary>
public interface ICloudBackupService
{
    Task UploadFileAsync(string localFilePath, CancellationToken cancellationToken = default);
}