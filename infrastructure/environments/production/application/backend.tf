terraform {
  backend "azurerm" {
    resource_group_name  = "trashify-tstate-rg"
    storage_account_name = "trashifytfstate31919"
    container_name       = "tfstate"
    key                  = "application.tfstate"
  }
}
