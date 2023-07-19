terraform {
  required_providers {
    azurecaf = {
      source  = "aztfmod/azurecaf"
      version = "1.2.22"
    }
  }
}

resource "azurecaf_name" "container_registry" {
  name          = "trashify"
  resource_type = "azurerm_container_registry"
  suffixes      = [var.environment]
}

resource "azurerm_container_registry" "container-registry" {
  name                = azurecaf_name.container_registry.result
  resource_group_name = var.resource_group
  location            = var.location
  admin_enabled       = true
  sku                 = "Basic"

  tags = {
    "environment"      = var.environment
    "application-name" = "trashify"
  }
}

resource "azurecaf_name" "app_service_plan" {
  name          = var.application_name
  resource_type = "azurerm_app_service_plan"
  suffixes      = [var.environment]
}

# This creates the plan that the service use
resource "azurerm_service_plan" "application" {
  name                = azurecaf_name.app_service_plan.result
  resource_group_name = var.resource_group
  location            = var.location

  sku_name = "F1"
  os_type  = "Linux"

  tags = {
    "environment"      = var.environment
    "application-name" = var.application_name
  }
}

resource "azurecaf_name" "app_service" {
  name          = var.application_name
  resource_type = "azurerm_app_service"
  suffixes      = [var.environment]
}

# This creates the service definition
resource "azurerm_linux_web_app" "application" {
  name                = azurecaf_name.app_service.result
  resource_group_name = var.resource_group
  location            = var.location
  service_plan_id     = azurerm_service_plan.application.id
  https_only          = true

  tags = {
    "environment"      = var.environment
    "application-name" = var.application_name
  }

  site_config {
    application_stack {
      docker_image     = "${azurerm_container_registry.container-registry.name}.azurecr.io/${var.application_name}"
      docker_image_tag = "latest"
    }
    always_on     = false
    ftps_state    = "Disabled"
    http2_enabled = true
  }

  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_REGISTRY_SERVER_URL"          = "https://${azurerm_container_registry.container-registry.name}.azurecr.io"
    "DOCKER_REGISTRY_SERVER_USERNAME"     = azurerm_container_registry.container-registry.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD"     = azurerm_container_registry.container-registry.admin_password
    "WEBSITES_CONTAINER_START_TIME_LIMIT" = 1500
    "PORT"                                = var.application_port
    "WEBSITES_PORT"                       = var.application_port
    "ACCOUNTS_SERVICE_PORT"               = var.accounts_service_port
    "ACCOUNTS_SERVICE_URL"                = var.accounts_service_host

    # Monitoring with Azure Application Insights
    "APPINSIGHTS_INSTRUMENTATIONKEY" = var.azure_application_insights_instrumentation_key

    # These are app specific environment variables
    "STORAGE_ACCOUNT_NAME"  = var.azure_storage_account_name
    "STORAGE_BLOB_ENDPOINT" = var.azure_storage_blob_endpoint
    "STORAGE_ACCOUNT_KEY"   = var.azure_storage_account_key

    "MONGODB_ACCOUNTS_DATABASE" = var.azure_cosmosdb_mongodb_accounts_database
    "MONGODB_ACCOUNTS_URI"      = var.azure_cosmosdb_mongodb_accounts_uri

    "JWT_ALGORITHM"            = var.jwt_algorithm
    "JWT_ACCESS_TOKEN_SECRET"  = var.jwt_access_token_secret
    "JWT_ACCESS_TOKEN_TTL"     = var.jwt_access_token_ttl
    "JWT_REFRESH_TOKEN_SECRET" = var.jwt_refresh_token_secret
    "JWT_REFRESH_TOKEN_TTL"    = var.jwt_refresh_token_ttl
  }
}

data "azurerm_client_config" "current" {}

resource "azurerm_key_vault_access_policy" "application" {
  key_vault_id = var.vault_id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_linux_web_app.application.identity[0].principal_id

  secret_permissions = [
    "Get",
    "List"
  ]
}
