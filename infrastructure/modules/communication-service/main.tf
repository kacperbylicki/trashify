terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.54.0"
    }

    azapi = {
      source  = "azure/azapi"
      version = "1.9.0"
    }
  }
}

resource "azurerm_email_communication_service" "email_service" {
  name     = "${var.app_prefix}-communication-service"
  data_location = var.data_location
  resource_group_name = var.resource_group_id
}


resource "azapi_resource" "comm-service" {
  type      = "Microsoft.Communication/communicationServices@2023-04-01-preview"
  name      = "${var.app_prefix}-comm-service"
  location  = "Global"
  parent_id = var.resource_group_id
  tags = {
    project = "trashify"
    status  = "test"
  }
  body = jsonencode({
    properties = {
      dataLocation = var.data_location
      linkedDomains = [
        azapi_resource.managed-domain.id
      ]
    }
  })
}

resource "azapi_resource" "email_communication_service" {
  type      = "Microsoft.Communication/emailServices@2023-04-01-preview"
  name      = "${var.app_prefix}-email-communication-service"
  location  = "Global"
  parent_id = var.resource_group_id
  tags = {
    project = "trashify"
    status  = "test"
  }
  body = jsonencode({
    properties = {
      dataLocation = var.data_location
    }
  })
}

resource "azapi_resource" "managed-domain" {
  type      = "Microsoft.Communication/emailServices/domains@2023-03-01-preview"
  name      = "AzureManagedDomain"
  location  = "Global"
  parent_id = azapi_resource.email_communication_service.id
  body = jsonencode({
    properties = {
      domainManagement       = "AzureManaged"
      userEngagementTracking = "Disabled"
    }
  })

  lifecycle {
    prevent_destroy = true
  }
}

