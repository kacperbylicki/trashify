variable "terraform_storage_account" {
  type        = string
  description = "When using an Azure back-end, the name of the Azure Storage Account that stores the Terraform state"
}

variable "jwt_access_token_secret" {
  type        = string
  description = "The secret used to sign the JWT access token"
}

variable "jwt_refresh_token_secret" {
  type        = string
  description = "The secret used to sign the JWT refresh token"
}

variable "environment" {
  type        = string
  description = "The environment (staging, production)"
  default     = "production"
}

variable "location" {
  type        = string
  description = "The Azure region where all resources in this example should be created"
  default     = "westeurope"
}
