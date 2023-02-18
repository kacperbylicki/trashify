variable "application_name" {
  type        = string
  description = "The name of your application"
  default     = "trashify"
}

variable "terraform_storage_account" {
  type        = string
  description = "When using an Azure back-end, the name of the Azure Storage Account that stores the Terraform state"
}

variable "environment" {
  type        = string
  description = "The environment (staging, production)"
  default     = "staging"
}

variable "location" {
  type        = string
  description = "The Azure region where all resources in this example should be created"
  default     = "westeurope"
}