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

variable "azure_cosmosdb_mongodb_database" {
  type        = string
  description = "The Cosmos DB with MongoDB API database name"
  default     = "Trashify"
}

variable "azure_cosmosdb_mongodb_uri" {
  type        = string
  description = "The Cosmos DB with MongoDB API database URI"
}

variable "azure_cosmosdb_mongodb_database_accounts_collection" {
  type        = string
  description = "The Cosmos DB with MongoDB API database accounts collection"
  default     = "Accounts"
}

variable "port" {
  type        = string
  description = "Port of the application"
  default     = "3000"
}