terraform {
  required_providers {
    azurecaf = {
      source  = "aztfmod/azurecaf"
      version = "1.2.22"
    }
  }
}

resource "azurecaf_name" "custom_vision" {
  name          = var.instance_name
  resource_type = "azurerm_cognitive_account"
  suffixes      = [var.environment]
}

resource "azurerm_cognitive_account" "custom_vision" {
  name                = var.instance_name
  resource_group_name = var.resource_group
  location            = var.location
  kind                = var.instance_kind
  sku_name            = "F0"

  tags = {
    "Environment" = var.environment
    "CostCenter"  = "ML/AI"
  }

}