variable "data_location" {
  type        = string
  description = "The Azure region where all resources in this example should be created"
  default     = "Europe"
}

variable "app_prefix" {
  type        = string
  description = "The name of the application"
  default     = ""
}

variable "resource_group_id" {
  type = string
  description = "Resource group ID for the service."
  default = ""
}
