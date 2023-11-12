terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.54.0"
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
      prevent_deletion_if_contains_resources = true
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

module "container-registry" {
  source         = "../../../modules/container-registry"
  environment    = var.environment
  resource_group = azurerm_resource_group.main.name
  location       = var.location
}

resource "azurecaf_name" "app_service_plan" {
  name          = var.application_name
  resource_type = "azurerm_app_service_plan"
  suffixes      = [var.environment]
}

# This creates the plan that the service use
resource "azurerm_service_plan" "application" {
  name                = azurecaf_name.app_service_plan.result
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location

  sku_name = "F1"
  os_type  = "Linux"

  tags = {
    "environment"      = var.environment
    "application-name" = var.application_name
  }
}

module "trash-service-application-insights" {
  source = "../../../modules/application-insights"
  resource_group = azurerm_resource_group.main.name
  application_name = "${var.application_name}-trash-service"
  environment = var.environment
  location = var.location
}

module "trash-service" {
  source                      = "../../../modules/app-service"
  resource_group              = azurerm_resource_group.main
  application_name            = "${var.application_name}-trash-service"
  environment                 = var.environment
  location                    = var.location
  service_plan_application_id = azurerm_service_plan.application.id

  docker_registry_name            = module.container-registry.container_registry_name
  docker_registry_server_url      = "https://${module.container-registry.container_registry_login_server}"
  docker_registry_server_username = module.container-registry.container_registry_admin_username
  docker_registry_server_password = module.container-registry.container_registry_admin_password

  azure_application_insights_instrumentation_key = module.trash-service-application-insights.azure_application_insights_instrumentation_key

  vault_id = module.key-vault.vault_id

  azure_cosmosdb_mongodb_accounts_database = module.cosmosdb-mongodb.azure_cosmosdb_mongodb_database
  azure_cosmosdb_mongodb_accounts_uri      = "@Microsoft.KeyVault(SecretUri=${module.key-vault.vault_uri}secrets/cosmosdb-mongodb-uri)"

  application_port = 50003
}


module "mailing-service-application-insights" {
  source           = "../../../modules/application-insights"
  resource_group   = azurerm_resource_group.main.name
  application_name = "${var.application_name}-mailing-service"
  environment      = var.environment
  location         = var.location
}

module "mailing-service" {
  source                      = "../../../modules/app-service"
  resource_group              = azurerm_resource_group.main.name
  application_name            = "${var.application_name}-mailing-service"
  environment                 = var.environment
  location                    = var.location
  service_plan_application_id = azurerm_service_plan.application.id


  docker_registry_name            = module.container-registry.container_registry_name
  docker_registry_server_url      = "https://${module.container-registry.container_registry_login_server}"
  docker_registry_server_username = module.container-registry.container_registry_admin_username
  docker_registry_server_password = module.container-registry.container_registry_admin_password

  azure_application_insights_instrumentation_key = module.mailing-service-application-insights.azure_application_insights_instrumentation_key

  vault_id = module.key-vault.vault_id

  azure_cosmosdb_mongodb_accounts_database = module.cosmosdb-mongodb.azure_cosmosdb_mongodb_database
  azure_cosmosdb_mongodb_accounts_uri      = "@Microsoft.KeyVault(SecretUri=${module.key-vault.vault_uri}secrets/cosmosdb-mongodb-uri)"

  application_port = 50002
}

module "accounts-service-application-insights" {
  source           = "../../../modules/application-insights"
  resource_group   = azurerm_resource_group.main.name
  application_name = "${var.application_name}-accounts-service"
  environment      = var.environment
  location         = var.location
}

module "accounts-service" {
  source                      = "../../../modules/app-service"
  resource_group              = azurerm_resource_group.main.name
  application_name            = "${var.application_name}-accounts-service"
  environment                 = var.environment
  location                    = var.location
  service_plan_application_id = azurerm_service_plan.application.id

  docker_registry_name            = module.container-registry.container_registry_name
  docker_registry_server_url      = "https://${module.container-registry.container_registry_login_server}"
  docker_registry_server_username = module.container-registry.container_registry_admin_username
  docker_registry_server_password = module.container-registry.container_registry_admin_password

  azure_application_insights_instrumentation_key = module.accounts-service-application-insights.azure_application_insights_instrumentation_key

  vault_id = module.key-vault.vault_id

  azure_cosmosdb_mongodb_accounts_database = module.cosmosdb-mongodb.azure_cosmosdb_mongodb_database
  azure_cosmosdb_mongodb_accounts_uri      = "@Microsoft.KeyVault(SecretUri=${module.key-vault.vault_uri}secrets/cosmosdb-mongodb-uri)"

  jwt_access_token_secret  = "@Microsoft.KeyVault(SecretUri=${module.key-vault.vault_uri}secrets/jwt_access_token_secret)"
  jwt_refresh_token_secret = "@Microsoft.KeyVault(SecretUri=${module.key-vault.vault_uri}secrets/jwt_refresh_token_secret)"

  mailing_service_host = module.mailing-service.application_url
  application_port     = 50001
}

module "api-gateway-service-application-insights" {
  source           = "../../../modules/application-insights"
  resource_group   = azurerm_resource_group.main.name
  application_name = "${var.application_name}-api-gateway-service"
  environment      = var.environment
  location         = var.location
}

module "api-gateway-service" {
  source                      = "../../../modules/app-service"
  resource_group              = azurerm_resource_group.main.name
  application_name            = "${var.application_name}-api-gateway-service"
  environment                 = var.environment
  location                    = var.location
  service_plan_application_id = azurerm_service_plan.application.id

  docker_registry_name            = module.container-registry.container_registry_name
  docker_registry_server_url      = "https://${module.container-registry.container_registry_login_server}"
  docker_registry_server_username = module.container-registry.container_registry_admin_username
  docker_registry_server_password = module.container-registry.container_registry_admin_password

  azure_application_insights_instrumentation_key = module.api-gateway-service-application-insights.azure_application_insights_instrumentation_key

  vault_id = module.key-vault.vault_id

  accounts_service_host = module.accounts-service.application_url
  mailing_service_host  = module.mailing-service.application_url
  application_port      = 50000
}

# TODO: Add trash-service module & microservice

module "communication-service" {
  source            = "../../../modules/communication-service"
  app_prefix        = var.application_name
  resource_group_id = azurerm_resource_group.main.id
}

module "key-vault" {
  source           = "../../../modules/key-vault"
  resource_group   = azurerm_resource_group.main.name
  application_name = var.application_name
  environment      = var.environment
  location         = var.location

  cosmosdb_mongodb_uri     = module.cosmosdb-mongodb.azure_cosmosdb_mongodb_uri
  jwt_access_token_secret  = var.jwt_access_token_secret
  jwt_refresh_token_secret = var.jwt_refresh_token_secret
}

module "cosmosdb-mongodb" {
  source           = "../../../modules/cosmosdb-mongodb"
  resource_group   = azurerm_resource_group.main.name
  application_name = var.application_name
  environment      = var.environment
  location         = var.location
}

module "storage-blob" {
  source           = "../../../modules/storage-blob"
  resource_group   = azurerm_resource_group.main.name
  application_name = var.application_name
  environment      = var.environment
  location         = var.location
}
