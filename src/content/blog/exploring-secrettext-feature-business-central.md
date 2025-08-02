---
title: "Exploring the New SecretText Feature in Business Central Control Add-ins"
description: "Master the SecretText feature introduced in 2025 release wave 1. Complete guide to secure data handling in control add-ins and JSON objects with AL code examples and compliance best practices."
date: "2025-07-21"
readingTime: 8
featured: true
tags: ["Business Central", "AL Development", "Microsoft Dynamics 365", "SecretText", "Control Add-ins", "Security"]
categories: ["Development", "Security", "Tutorial"]
author: "Ricardo Carvalho"
published: true
---

# Exploring the New SecretText Feature in Business Central Control Add-ins

The **2025 release wave 1** of Microsoft Dynamics 365 Business Central introduced a game-changing feature that many developers have been waiting for: **SecretText support in control add-ins and JSON objects**. 🔐

This enhancement addresses one of the most critical aspects of modern business applications: **secure handling of sensitive data** like passwords, API keys, and other confidential information.

## Why SecretText Matters More Than Ever

In today's security-conscious environment, exposing sensitive data through inadequate handling can lead to:

- **Compliance violations** (GDPR, SOX, HIPAA)
- **Data breaches** and security incidents  
- **Lost customer trust** and reputation damage
- **Financial penalties** and legal consequences

The SecretText feature ensures that sensitive data is **never stored in plain text** and is automatically masked in the UI.

## The Problem with Traditional Approaches

Before this release, developers had to implement workarounds:

```al
// ❌ Old approach - Security risk!
procedure SetApiKey(ApiKey: Text)
begin
    // This stores the key in plain text
    GlobalApiKey := ApiKey;
end;
```

This approach had several issues:
- **Plain text storage** in memory
- **Visible in debugger** sessions
- **Logged in telemetry** data
- **Potential exposure** in error messages

## The SecretText Solution

Now, Business Central provides native SecretText support:

```al
// ✅ New secure approach
procedure SetApiKey(ApiKey: SecretText)
var
    SecureStorage: Codeunit "Secret Storage";
begin
    // Automatically encrypted and secured
    SecureStorage.SetSecret('API_KEY', ApiKey);
end;
```

## Implementing SecretText in Control Add-ins

### Step 1: Define Your Control Add-in Interface

```al
controladdin SecureInputAddin
{
    StartupScript = 'js/SecureInput.js';
    StyleSheets = 'css/SecureInput.css';
    
    event OnSecretValueChanged(SecretValue: SecretText);
    
    procedure SetPlaceholder(PlaceholderText: Text);
    procedure ClearValue();
    procedure SetMaskCharacter(MaskChar: Text);
}
```

### Step 2: Create the JavaScript Implementation

```javascript
// SecureInput.js
Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnSecretValueChanged', [
    {
        value: maskedInput.value,
        isSecret: true
    }
]);
```

### Step 3: Handle SecretText in AL Code

```al
page 50100 "Secure Configuration"
{
    layout
    {
        area(Content)
        {
            usercontrol(SecureInput; SecureInputAddin)
            {
                trigger OnSecretValueChanged(SecretValue: SecretText)
                begin
                    // Secure handling of the secret value
                    ProcessSecretData(SecretValue);
                end;
            }
        }
    }
    
    local procedure ProcessSecretData(Secret: SecretText)
    var
        SecretMgmt: Codeunit "Secret Management";
    begin
        // Store securely
        SecretMgmt.StoreSecret('USER_PASSWORD', Secret);
        
        // Use for authentication
        AuthenticateWithSecret(Secret);
    end;
}
```

## Working with JSON and SecretText

One of the most exciting features is **SecretText integration with JSON objects**:

```al
procedure HandleSecureApiRequest()
var
    JsonObj: JsonObject;
    ApiKey: SecretText;
    Response: Text;
begin
    // Add SecretText to JSON
    JsonObj.Add('apiKey', ApiKey);
    JsonObj.Add('endpoint', 'https://api.example.com/data');
    
    // The API key is automatically secured
    CallExternalApi(JsonObj, Response);
end;
```

## Best Practices for SecretText Implementation

### 🔒 Always Use SecretText for Sensitive Data

```al
// ❌ Don't do this
UserPassword := 'mypassword123';

// ✅ Do this instead
UserPassword: SecretText;
UserPassword := SecretText.SecretStrSubstNo('mypassword123');
```

### 🎯 Implement Proper Error Handling

```al
local procedure ValidateSecretInput(Secret: SecretText): Boolean
begin
    if Secret.IsEmpty() then begin
        Error('Secret value cannot be empty');
        exit(false);
    end;
    
    // Additional validation logic
    exit(true);
end;
```

### 🔄 Clear Secrets After Use

```al
procedure ProcessAndClearSecret(var Secret: SecretText)
begin
    try
        ProcessSecretData(Secret);
    finally
        Clear(Secret); // Ensure memory is cleared
    end;
end;
```

## Real-World Implementation Example

Here's a complete example of a secure API integration setup:

```al
page 50101 "API Configuration Setup"
{
    PageType = Card;
    ApplicationArea = All;
    
    layout
    {
        area(Content)
        {
            group(Authentication)
            {
                field("API Endpoint"; ApiEndpoint)
                {
                    ApplicationArea = All;
                }
                
                usercontrol(ApiKeyInput; SecureInputAddin)
                {
                    trigger OnSecretValueChanged(ApiKey: SecretText)
                    begin
                        StoreApiKey(ApiKey);
                        TestConnection();
                    end;
                }
            }
        }
    }
    
    var
        ApiEndpoint: Text[250];
        
    local procedure StoreApiKey(ApiKey: SecretText)
    var
        SecretStorage: Codeunit "Secret Storage";
    begin
        SecretStorage.SetSecret('API_KEY', ApiKey);
        Message('API key securely stored ✅');
    end;
    
    local procedure TestConnection()
    var
        HttpClient: HttpClient;
        Response: HttpResponseMessage;
        SecretStorage: Codeunit "Secret Storage";
        ApiKey: SecretText;
    begin
        ApiKey := SecretStorage.GetSecret('API_KEY');
        
        // Use SecretText in HTTP headers
        HttpClient.DefaultRequestHeaders.Add('Authorization', 
            SecretText.SecretStrSubstNo('Bearer %1', ApiKey));
            
        if HttpClient.Get(ApiEndpoint, Response) then
            Message('Connection successful! 🎉')
        else
            Error('Connection failed ❌');
    end;
}
```

## Performance and Security Considerations

### Memory Management
- SecretText values are **automatically encrypted** in memory
- **Garbage collection** handles cleanup securely
- **No plain text traces** left in memory dumps

### Debugging and Telemetry
- SecretText values show as **"***"** in debugger
- **Not logged** in telemetry data
- **Safe from accidental exposure** in error messages

## Migration Strategy

If you're updating existing code, follow this systematic approach:

### Phase 1: Identify Sensitive Data
```al
// Audit your codebase for these patterns:
Password: Text;
ApiKey: Text;
Token: Text;
Secret: Text;
```

### Phase 2: Update Data Types
```al
// Convert to SecretText
Password: SecretText;
ApiKey: SecretText;
Token: SecretText;
Secret: SecretText;
```

### Phase 3: Update All References
```al
// Update method signatures
procedure Authenticate(UserPassword: SecretText)
// Update assignments
Password := SecretText.SecretStrSubstNo('%1', InputValue);
```

## Compliance and Audit Benefits

Using SecretText helps you achieve:

- ✅ **GDPR compliance** through data protection by design
- ✅ **SOX compliance** with proper internal controls
- ✅ **Industry standards** (ISO 27001, PCI DSS)
- ✅ **Audit trail** with secure logging practices

## What's Next? 🚀

The SecretText feature opens up new possibilities for:

- **Enhanced API integrations** with third-party services
- **Secure configuration management** for extensions
- **Improved user experience** with masked input fields
- **Better compliance** with data protection regulations

## Key Takeaways

1. **SecretText is now natively supported** in control add-ins and JSON objects
2. **Automatic encryption** and secure memory handling
3. **Compliance-ready** out of the box
4. **Easy migration** from existing Text-based implementations
5. **Better debugging experience** with masked values

Ready to implement SecretText in your Business Central solutions? Start with your most sensitive data points and gradually migrate your entire application to this more secure approach.

For more advanced Business Central development patterns, check out our article on [Advanced AL Development: Working with Interfaces and Abstract Classes](/insights/advanced-al-development-interfaces-abstract-classes) and learn about [Performance Tuning Your Business Central Extensions](/insights/performance-tuning-business-central-extensions).

---

*Have questions about implementing SecretText? Drop me a line at [ricardo.sampaio@gmail.com](mailto:ricardo.sampaio@gmail.com) or connect with me on [LinkedIn](https://www.linkedin.com/in/ricardo-carvalho-05741519). I'd love to hear about your implementation experiences!* 💬
