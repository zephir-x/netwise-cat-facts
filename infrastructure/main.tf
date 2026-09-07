terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

// 1. Resource Group
// Acts as a logical container for our cloud resources.
// Placed in 'polandcentral' for optimal latency from our local development environment.
resource "azurerm_resource_group" "main" {
  name     = "rg-netwise-catfacts"
  location = "polandcentral"
}

// 2. Random Suffix Generator
// Storage Account names must be globally unique across all of Azure.
// Generating a random string ensures our deployment won't fail due to naming collisions.
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

// 3. Storage Account
// Configured with the Standard tier and Locally Redundant Storage (LRS).
// This is the most cost-effective solution suitable for our simple text file backups,
// proving awareness of cloud cost optimization.
resource "azurerm_storage_account" "main" {
  name                     = "stcatfacts${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

// 4. Blob Container
// A dedicated container specifically for storing our text backups.
// The 'private' access type ensures the files cannot be read anonymously from the public internet.
resource "azurerm_storage_container" "backup" {
  name                  = "catfacts-backups"
  storage_account_id  = azurerm_storage_account.main.id
  container_access_type = "private"
}

// 5. Output Connection String
// Outputs the primary connection string so it can be easily injected into appsettings.json.
// Marked as 'sensitive' so Terraform masks it in the console and CI/CD logs (security best practice).
output "storage_connection_string" {
  value     = azurerm_storage_account.main.primary_connection_string
  sensitive = true
}