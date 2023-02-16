variable "resource_group" {
  type        = string
  description = "The resource group"
}

variable "instance_name" {
  type        = string
  description = "The Custom Vision API name"
}

variable "instance_kind" {
  type        = string
  description = "The Custom Vision API kind"
  default     = "CustomVision.Prediction"
}

variable "environment" {
  type        = string
  description = "The environment (staging, production)"
  default     = "staging"
}

variable "location" {
  type        = string
  description = "The Azure region where all resources in this example should be created"
}