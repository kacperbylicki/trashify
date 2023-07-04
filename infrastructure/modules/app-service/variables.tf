variable "resource_group" {
  type        = string
  description = "The resource group"
}

variable "application_name" {
  type        = string
  description = "The name of your application"
}

variable "environment" {
  type        = string
  description = "The environment (staging, production)"
}

variable "location" {
  type        = string
  description = "The Azure region where all resources in this example should be created"
}

variable "azure_application_insights_instrumentation_key" {
  type        = string
  description = "The Azure Application Insights instrumentation key"
}

variable "vault_id" {
  type        = string
  description = "The Azure Key Vault ID"
}

variable "azure_storage_account_name" {
  type        = string
  description = "The name of the Azure Storage account"
}

variable "azure_storage_account_key" {
  type        = string
  description = "The access key of the Azure Storage account"
}

variable "azure_storage_blob_endpoint" {
  type        = string
  description = "The blob endpoint URL of the Azure Storage account"
}

variable "azure_cosmosdb_mongodb_accounts_database" {
  type        = string
  description = "The Cosmos DB with MongoDB API database name"
  default     = "Accounts"
}

variable "azure_cosmosdb_mongodb_accounts_uri" {
  type        = string
  description = "The Cosmos DB with MongoDB API database URI"
}

variable "jwt_algorithm" {
  type        = string
  description = "The algorithm used to sign the JWT"
  default     = "HS512"
}

variable "jwt_access_token_secret" {
  type        = string
  description = "The secret used to sign the JWT access token"
}

variable "jwt_access_token_ttl" {
  type        = string
  description = "The TTL of the JWT access token"
  default     = "15m"
}

variable "jwt_refresh_token_secret" {
  type        = string
  description = "The secret used to sign the JWT refresh token"
}

variable "jwt_refresh_token_ttl" {
  type        = string
  description = "The TTL of the JWT refresh token"
  default     = "7d"
}

variable "port" {
  type        = string
  description = "Port of the application"
  default     = "3000"
}

variable "api_gateway_host" {
  type        = string
  description = "The host of the API Gateway"
}

variable "accounts_service_host" {
  type        = string
  description = "The host of the Accounts Service"
}
