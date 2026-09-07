using Azure.Storage.Blobs;
using CatFacts.Api.Interfaces;

namespace CatFacts.Api.Services;

/// <summary>
/// Service responsible for securely uploading files to Azure Blob Storage.
/// </summary>
public class CloudBackupService(IConfiguration configuration, ILogger<CloudBackupService> logger) : ICloudBackupService
{
    public async Task UploadFileAsync(string localFilePath, CancellationToken cancellationToken = default)
    {
        try
        {
            var connectionString = configuration["Azure:StorageConnectionString"];
            var containerName = configuration["Azure:BackupContainerName"];
            
            if (string.IsNullOrWhiteSpace(connectionString) || connectionString == "PLACEHOLDER")
            {
                logger.LogWarning("Azure Storage Connection String is missing. Skipping cloud backup.");
                return;
            }

            var blobServiceClient = new BlobServiceClient(connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            var fileName = Path.GetFileName(localFilePath);
            var blobClient = containerClient.GetBlobClient(fileName);

            // Upload the file, overwriting the existing one in the cloud
            await using var fileStream = File.OpenRead(localFilePath);
            await blobClient.UploadAsync(fileStream, overwrite: true, cancellationToken);

            logger.LogInformation("Successfully backed up {FileName} to Azure Blob Storage.", fileName);
        }
        catch (Exception ex)
        {
            // We catch the error so that a possible cloud failure won't be thrown via the HTTP 500 fallback
            logger.LogError(ex, "Failed to upload backup to Azure.");
        }
    }
}