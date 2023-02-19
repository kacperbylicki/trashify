terraform {
  backend "azurerm" {
    resource_group_name  = "trashify-tfstate-rg"
    storage_account_name = "trashifytfstate31919"
    container_name       = "tfstate"
    key                  = "actions.tfstate"
  }
}
