terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.32.0"
    }
    azurecaf = {
      source  = "aztfmod/azurecaf"
      version = "1.2.22"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

resource "azurecaf_name" "resource_group" {
  name          = "${var.application_name}-application"
  resource_type = "azurerm_resource_group"
  suffixes      = [var.environment]
}

resource "azurerm_resource_group" "main" {
  name     = azurecaf_name.resource_group.result
  location = var.location

  tags = {
    "terraform"        = "true"
    "environment"      = var.environment
    "application-name" = var.application_name

    // Name of the Azure Storage Account that stores the Terraform state
    "terraform_storage_account" = var.terraform_storage_account
  }
}

module "application" {
  source           = "../../../modules/app-service"
  resource_group   = azurerm_resource_group.main.name
  application_name = var.application_name
  environment      = var.environment
  location         = var.location

  azure_application_insights_instrumentation_key = module.application-insights.azure_application_insights_instrumentation_key

  vault_id = module.key-vault.vault_id

  azure_cosmosdb_mongodb_database = module.cosmosdb-mongodb.azure_cosmosdb_mongodb_database
  azure_cosmosdb_mongodb_uri      = "@Microsoft.KeyVault(SecretUri=${module.key-vault.vault_uri}secrets/cosmosdb-mongodb-uri)"
}

module "application-insights" {
  source           = "../../../modules/application-insights"
  resource_group   = azurerm_resource_group.main.name
  application_name = var.application_name
  environment      = var.environment
  location         = var.location
}

module "key-vault" {
  source           = "../../../modules/key-vault"
  resource_group   = azurerm_resource_group.main.name
  application_name = var.application_name
  environment      = var.environment
  location         = var.location

  cosmosdb_mongodb_uri = module.cosmosdb-mongodb.azure_cosmosdb_mongodb_uri
}

module "cosmosdb-mongodb" {
  source           = "../../../modules/cosmosdb-mongodb"
  resource_group   = azurerm_resource_group.main.name
  application_name = var.application_name
  environment      = var.environment
  location         = var.location
}