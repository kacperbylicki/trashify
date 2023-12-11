
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/api/v1/trash": {
        "get": {
          "operationId": "TrashController_getAll",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GetAllTrashResponseDto"
                  }
                }
              }
            },
            "401": {
              "description": "Invalid token"
            }
          },
          "tags": [
            "TrashController"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "post": {
          "operationId": "TrashController_create",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateTrashRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreateTrashResponseDto"
                  }
                }
              }
            },
            "401": {
              "description": "Invalid token"
            }
          },
          "tags": [
            "TrashController"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/trash/tags/{tags}": {
        "get": {
          "operationId": "TrashController_getByTags",
          "parameters": [
            {
              "name": "tags",
              "required": true,
              "in": "query",
              "schema": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GetTrashByTagsResponseDto"
                  }
                }
              }
            },
            "401": {
              "description": "Invalid token"
            }
          },
          "tags": [
            "TrashController"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/trash/distance": {
        "get": {
          "operationId": "TrashController_getInDistance",
          "parameters": [
            {
              "name": "minDistance",
              "required": false,
              "in": "query",
              "description": "Minimum distance in meters from the geographical position.",
              "schema": {
                "default": 5,
                "type": "number"
              }
            },
            {
              "name": "maxDistance",
              "required": false,
              "in": "query",
              "description": "Maximum distance in meters from the geographical position.",
              "schema": {
                "default": 1500,
                "type": "number"
              }
            },
            {
              "name": "latitude",
              "required": true,
              "in": "query",
              "description": "Geographical latitude of users position.",
              "example": 49.882786,
              "schema": {
                "format": "float",
                "type": "number"
              }
            },
            {
              "name": "longitude",
              "required": true,
              "in": "query",
              "description": "Geographical longitude of users position.",
              "example": 19.493958,
              "schema": {
                "format": "float",
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GetTrashInDistanceResponseDto"
                  }
                }
              }
            },
            "401": {
              "description": "Invalid token"
            }
          },
          "tags": [
            "TrashController"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/trash/{uuid}": {
        "patch": {
          "operationId": "TrashController_update",
          "parameters": [
            {
              "name": "uuid",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateTrashRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdateTrashResponseDto"
                  }
                }
              }
            },
            "401": {
              "description": "Invalid token"
            }
          },
          "tags": [
            "TrashController"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/accounts/me": {
        "get": {
          "operationId": "AccountController_currentAccount",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Currently logged account retrieved",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GetAccountResponseDto"
                  }
                }
              }
            },
            "401": {
              "description": "Invalid token"
            }
          },
          "tags": [
            "AccountController"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/accounts/login": {
        "post": {
          "operationId": "AccountController_login",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Logged in",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/LoginResponseDto"
                  }
                }
              }
            },
            "401": {
              "description": "Invalid token"
            }
          },
          "tags": [
            "AccountController"
          ]
        }
      },
      "/api/v1/accounts/register": {
        "post": {
          "operationId": "AccountController_register",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegisterRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Account created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RegisterResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "AccountController"
          ]
        }
      },
      "/api/v1/accounts/resend-verification": {
        "post": {
          "operationId": "AccountController_resendEmailConfirmation",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResendRegistrationConfirmationEmailRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ResendRegistrationConfirmationEmailResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "AccountController"
          ]
        }
      },
      "/api/v1/accounts/logout": {
        "post": {
          "operationId": "AccountController_logout",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Logged out"
            },
            "401": {
              "description": "Invalid token"
            }
          },
          "tags": [
            "AccountController"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/accounts/refresh-token": {
        "post": {
          "operationId": "AccountController_refreshToken",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RefreshTokenRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Access token refreshed",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RefreshTokenResponseDto"
                  }
                }
              }
            },
            "401": {
              "description": "Invalid token"
            }
          },
          "tags": [
            "AccountController"
          ]
        }
      },
      "/api/v1/accounts/email": {
        "post": {
          "operationId": "AccountController_changeEmail",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChangeEmailDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Email changed.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ChangeEmailResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "AccountController"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/accounts/username": {
        "post": {
          "operationId": "AccountController_changeUsername",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChangeUsernameDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Account username changed.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ChangeUsernameResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "AccountController"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/accounts/reset-password": {
        "post": {
          "operationId": "AccountController_createResetPasswordToken",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResetPasswordDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Reset password link sent",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ResetPasswordResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "AccountController"
          ]
        }
      },
      "/api/v1/accounts/change-password": {
        "get": {
          "operationId": "AccountController_changePasswordForm",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "AccountController"
          ]
        },
        "post": {
          "operationId": "AccountController_changePassword",
          "parameters": [
            {
              "name": "token",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChangePasswordDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Password changed.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ChangePasswordResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "AccountController"
          ]
        }
      },
      "/api/v1/accounts/confirm-registration": {
        "get": {
          "operationId": "AccountController_confirmRegistration",
          "parameters": [
            {
              "name": "uuid",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "uuid",
              "in": "query",
              "required": true,
              "schema": {
                "type": "uuid"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "AccountController"
          ]
        }
      },
      "/api/v1/accounts/confirm-email": {
        "get": {
          "operationId": "AccountController_confirmEmailTemplate",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "AccountController"
          ]
        },
        "patch": {
          "operationId": "AccountController_confirmEmail",
          "parameters": [
            {
              "name": "token",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "description": "Email confirmation token.",
              "name": "token",
              "in": "query",
              "required": true,
              "schema": {
                "type": "jwt"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "AccountController"
          ]
        }
      },
      "/health": {
        "get": {
          "operationId": "HealthController_check",
          "parameters": [],
          "responses": {
            "200": {
              "description": "The Health Check is successful",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "string",
                        "example": "ok"
                      },
                      "info": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": {
                            "type": "string"
                          }
                        },
                        "nullable": true
                      },
                      "error": {
                        "type": "object",
                        "example": {},
                        "additionalProperties": {
                          "type": "object",
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": {
                            "type": "string"
                          }
                        },
                        "nullable": true
                      },
                      "details": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": {
                            "type": "string"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "503": {
              "description": "The Health Check is not successful",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "string",
                        "example": "error"
                      },
                      "info": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": {
                            "type": "string"
                          }
                        },
                        "nullable": true
                      },
                      "error": {
                        "type": "object",
                        "example": {
                          "redis": {
                            "status": "down",
                            "message": "Could not connect"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": {
                            "type": "string"
                          }
                        },
                        "nullable": true
                      },
                      "details": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          },
                          "redis": {
                            "status": "down",
                            "message": "Could not connect"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": {
                            "type": "string"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "HealthController"
          ]
        }
      }
    },
    "info": {
      "title": "Trashify",
      "description": "",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "TrashTags": {
          "type": "string",
          "enum": [
            "batteries",
            "bio",
            "bottleMachine",
            "mixed",
            "municipal",
            "paper",
            "petFeces",
            "plastic",
            "toners",
            "glass"
          ]
        },
        "TrashDto": {
          "type": "object",
          "properties": {
            "uuid": {
              "type": "string",
              "format": "uuid"
            },
            "geolocation": {
              "items": {
                "type": "string"
              },
              "example": [
                19.493958,
                49.882786
              ],
              "description": "Geographical longitude and latitude of the trash container.",
              "type": "array"
            },
            "tag": {
              "example": "batteries",
              "minLength": 1,
              "$ref": "#/components/schemas/TrashTags"
            }
          },
          "required": [
            "uuid",
            "geolocation",
            "tag"
          ]
        },
        "GetAllTrashResponseDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "number",
              "example": 200
            },
            "trash": {
              "$ref": "#/components/schemas/TrashDto"
            }
          },
          "required": [
            "status",
            "trash"
          ]
        },
        "GetTrashByTagsResponseDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "number",
              "example": 200
            },
            "trash": {
              "$ref": "#/components/schemas/TrashDto"
            }
          },
          "required": [
            "status",
            "trash"
          ]
        },
        "GetTrashInDistanceResponseDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "number",
              "example": 200
            },
            "trash": {
              "$ref": "#/components/schemas/TrashDto"
            }
          },
          "required": [
            "status",
            "trash"
          ]
        },
        "CreateTrashPayloadDto": {
          "type": "object",
          "properties": {
            "geolocation": {
              "items": {
                "type": "string"
              },
              "example": [
                19.493958,
                49.882786
              ],
              "description": "Geographical longitude and latitude of the trash container.",
              "type": "array"
            },
            "tag": {
              "example": "batteries",
              "minLength": 1,
              "$ref": "#/components/schemas/TrashTags"
            }
          },
          "required": [
            "geolocation",
            "tag"
          ]
        },
        "CreateTrashRequestDto": {
          "type": "object",
          "properties": {
            "trash": {
              "$ref": "#/components/schemas/CreateTrashPayloadDto"
            }
          },
          "required": [
            "trash"
          ]
        },
        "CreateTrashResponseDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "number",
              "example": 200
            }
          },
          "required": [
            "status"
          ]
        },
        "UpdateTrashPayloadDto": {
          "type": "object",
          "properties": {
            "tag": {
              "example": "batteries",
              "minLength": 1,
              "$ref": "#/components/schemas/TrashTags"
            },
            "geolocation": {
              "items": {
                "type": "string"
              },
              "example": [
                19.493958,
                49.882786
              ],
              "description": "Geographical longitude and latitude of the trash container.",
              "type": "array"
            }
          },
          "required": [
            "tag"
          ]
        },
        "UpdateTrashRequestDto": {
          "type": "object",
          "properties": {
            "trash": {
              "$ref": "#/components/schemas/UpdateTrashPayloadDto"
            }
          },
          "required": [
            "trash"
          ]
        },
        "UpdateTrashResponseDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "number",
              "example": 200
            }
          },
          "required": [
            "status"
          ]
        },
        "AccountDto": {
          "type": "object",
          "properties": {
            "uuid": {
              "type": "string",
              "format": "uuid"
            },
            "email": {
              "type": "string",
              "format": "email"
            },
            "username": {
              "type": "string",
              "example": "johndoe"
            }
          },
          "required": [
            "uuid",
            "email",
            "username"
          ]
        },
        "GetAccountResponseDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "number",
              "example": 200
            },
            "error": {
              "example": [
                "unauthorized"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "data": {
              "$ref": "#/components/schemas/AccountDto"
            }
          },
          "required": [
            "status",
            "error",
            "data"
          ]
        },
        "LoginRequestDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "format": "email"
            },
            "password": {
              "type": "string",
              "format": "password"
            }
          },
          "required": [
            "email",
            "password"
          ]
        },
        "LoginResponseData": {
          "type": "object",
          "properties": {
            "accessToken": {
              "type": "string",
              "example": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.VFb0qJ1LRg_4ujbZoRMXnVkUgiuKq5KxWqNdbKq_G9Vvz-S1zZa9LPxtHWKa64zDl2ofkT8F6jBt_K4riU-fPg"
            },
            "refreshToken": {
              "type": "string",
              "example": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.VFb0qJ1LRg_4ujbZoRMXnVkUgiuKq5KxWqNdbKq_G9Vvz-S1zZa9LPxtHWKa64zDl2ofkT8F6jBt_K4riU-fPg"
            }
          },
          "required": [
            "accessToken",
            "refreshToken"
          ]
        },
        "LoginResponseDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "number",
              "example": 200
            },
            "error": {
              "example": [
                "unauthorized"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "data": {
              "$ref": "#/components/schemas/LoginResponseData"
            }
          },
          "required": [
            "status",
            "error",
            "data"
          ]
        },
        "RegisterRequestDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "format": "email"
            },
            "username": {
              "type": "string",
              "example": "johndoe"
            },
            "password": {
              "type": "string",
              "format": "password"
            },
            "confirmPassword": {
              "type": "string",
              "format": "password"
            }
          },
          "required": [
            "email",
            "username",
            "password",
            "confirmPassword"
          ]
        },
        "RegisterResponseDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "number",
              "example": 201
            },
            "error": {
              "example": [
                "something went wrong"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "status",
            "error"
          ]
        },
        "ResendRegistrationConfirmationEmailRequestDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "format": "email"
            }
          },
          "required": [
            "email"
          ]
        },
        "ResendRegistrationConfirmationEmailResponseDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "number",
              "example": 200
            },
            "error": {
              "example": [
                "unauthorized"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "status",
            "error"
          ]
        },
        "RefreshTokenRequestDto": {
          "type": "object",
          "properties": {
            "refreshToken": {
              "type": "string",
              "example": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.VFb0qJ1LRg_4ujbZoRMXnVkUgiuKq5KxWqNdbKq_G9Vvz-S1zZa9LPxtHWKa64zDl2ofkT8F6jBt_K4riU-fPg"
            }
          },
          "required": [
            "refreshToken"
          ]
        },
        "RefreshTokenResponseData": {
          "type": "object",
          "properties": {
            "accessToken": {
              "type": "string",
              "example": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.VFb0qJ1LRg_4ujbZoRMXnVkUgiuKq5KxWqNdbKq_G9Vvz-S1zZa9LPxtHWKa64zDl2ofkT8F6jBt_K4riU-fPg"
            },
            "refreshToken": {
              "type": "string",
              "example": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.VFb0qJ1LRg_4ujbZoRMXnVkUgiuKq5KxWqNdbKq_G9Vvz-S1zZa9LPxtHWKa64zDl2ofkT8F6jBt_K4riU-fPg"
            }
          },
          "required": [
            "accessToken",
            "refreshToken"
          ]
        },
        "RefreshTokenResponseDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "number",
              "example": 200
            },
            "error": {
              "example": [
                "unauthorized"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "data": {
              "$ref": "#/components/schemas/RefreshTokenResponseData"
            }
          },
          "required": [
            "status",
            "error",
            "data"
          ]
        },
        "ChangeEmailDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "New user email.",
              "example": "paweł.wadowice@jan.pl"
            }
          },
          "required": [
            "email"
          ]
        },
        "ChangeEmailResponseDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "number",
              "example": 200
            },
            "email": {
              "type": "string",
              "description": "New user email."
            },
            "error": {
              "example": [
                "unauthorized"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "status",
            "email",
            "error"
          ]
        },
        "ChangeUsernameDto": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "New account username",
              "example": "Jan Pawłowicz Trzeci"
            }
          },
          "required": [
            "username"
          ]
        },
        "ChangeUsernameResponseDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "number",
              "example": 200
            },
            "username": {
              "type": "string",
              "description": "New account username",
              "example": "Jan Pawłowicz Trzeci"
            },
            "error": {
              "example": [
                "unauthorized"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "status",
            "username",
            "error"
          ]
        },
        "ResetPasswordDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "New user email.",
              "example": "paweł.wadowice@jan.pl"
            }
          },
          "required": [
            "email"
          ]
        },
        "ResetPasswordResponseDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "number",
              "example": 200
            }
          },
          "required": [
            "status"
          ]
        },
        "ChangePasswordDto": {
          "type": "object",
          "properties": {
            "password": {
              "type": "string",
              "description": "New account password.",
              "example": "such-Sec&re-Much-kREmowo-912-some71ng"
            },
            "repeatedPassword": {
              "type": "string",
              "description": "Repeated account password.",
              "example": "such-Sec&re-Much-kREmowo-912-some71ng"
            }
          },
          "required": [
            "password",
            "repeatedPassword"
          ]
        },
        "ChangePasswordResponseDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "number",
              "example": 200
            },
            "error": {
              "example": [
                "unauthorized"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "status",
            "error"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
