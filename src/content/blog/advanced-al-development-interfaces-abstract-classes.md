---
title: "Advanced AL Development: Working with Interfaces and Abstract Classes"
description: "Master advanced AL development techniques using interfaces and abstract classes. Build more flexible and maintainable extensions with proven enterprise patterns and examples."
date: "2025-07-21"
readingTime: 10
featured: true
tags: ["AL Development", "Interfaces", "Object-Oriented Programming", "Enterprise Patterns", "Code Architecture"]
categories: ["Development", "Advanced", "Best Practices"]
author: "Ricardo Carvalho"
published: true
---

Modern Business Central development has evolved far beyond simple procedural code. With the introduction of **interfaces** and **advanced object-oriented patterns** in AL, we can now build extensions that are more maintainable, testable, and scalable than ever before.

After architecting over 50+ enterprise-grade extensions, I've discovered that mastering these patterns isn't just about cleaner code—**it's about building systems that adapt to change without breaking**.

In this comprehensive guide, you'll learn the exact patterns I use to build flexible, maintainable Business Central extensions that scale with business requirements.

## Why Interfaces Matter in Business Central Development

### The Problem with Traditional AL Development

Most AL developers write code like this:

```al
codeunit 50100 "Order Processing"
{
    procedure ProcessOrder(SalesOrderNo: Code[20])
    var
        Customer: Record Customer;
        Item: Record Item;
        EmailMgt: Codeunit "Email Management";
    begin
        // Direct dependencies - RIGID and hard to test
        ValidateCustomer(SalesOrderNo);
        CheckInventoryAvailability(SalesOrderNo);
        EmailMgt.SendOrderConfirmation(SalesOrderNo);
        UpdateCustomerStatistics(SalesOrderNo);
    end;
}
```

**Problems with this approach:**
- **Tight coupling**: Hard to modify without affecting other parts
- **Difficult testing**: Can't mock dependencies
- **Poor maintainability**: Changes ripple through the codebase
- **Limited reusability**: Logic is locked into specific implementations

### The Interface-Based Solution

```al
// Define behavior contracts
interface "ICustomer Validator"
{
    procedure ValidateCustomer(CustomerNo: Code[20]): Boolean;
    procedure GetValidationErrors(): List of [Text];
}

interface "IInventory Service"
{
    procedure CheckAvailability(ItemNo: Code[20]; Quantity: Decimal): Boolean;
    procedure ReserveInventory(ItemNo: Code[20]; Quantity: Decimal): Boolean;
}

interface "INotification Service"
{
    procedure SendOrderConfirmation(OrderNo: Code[20]): Boolean;
    procedure SendShippingNotification(OrderNo: Code[20]): Boolean;
}

// Flexible implementation
codeunit 50101 "Advanced Order Processing"
{
    var
        CustomerValidator: Interface "ICustomer Validator";
        InventoryService: Interface "IInventory Service";
        NotificationService: Interface "INotification Service";
    
    procedure SetDependencies(
        CustValidator: Interface "ICustomer Validator";
        InvService: Interface "IInventory Service";
        NotifService: Interface "INotification Service")
    begin
        CustomerValidator := CustValidator;
        InventoryService := InvService;
        NotificationService := NotifService;
    end;
    
    procedure ProcessOrder(SalesOrderNo: Code[20]): Boolean
    var
        SalesHeader: Record "Sales Header";
        SalesLine: Record "Sales Line";
    begin
        if not SalesHeader.Get(SalesHeader."Document Type"::Order, SalesOrderNo) then
            exit(false);
            
        // Flexible validation using injected validator
        if not CustomerValidator.ValidateCustomer(SalesHeader."Sell-to Customer No.") then
            exit(false);
            
        // Check inventory using injected service
        SalesLine.SetRange("Document Type", SalesHeader."Document Type");
        SalesLine.SetRange("Document No.", SalesHeader."No.");
        if SalesLine.FindSet() then
            repeat
                if not InventoryService.CheckAvailability(SalesLine."No.", SalesLine.Quantity) then
                    exit(false);
            until SalesLine.Next() = 0;
            
        // Send notifications using injected service
        exit(NotificationService.SendOrderConfirmation(SalesOrderNo));
    end;
}
```

**Benefits of this pattern:**
- **Loose coupling**: Easy to swap implementations
- **Testable**: Can inject mock services for testing
- **Maintainable**: Changes isolated to specific implementations
- **Reusable**: Same interface, multiple implementations

## Pattern 1: Strategy Pattern for Business Rules

### Use Case: Dynamic Pricing Strategies

Different customers require different pricing strategies. Instead of complex if-else chains, use interfaces:

```al
interface "IPricing Strategy"
{
    procedure CalculatePrice(ItemNo: Code[20]; Quantity: Decimal; CustomerNo: Code[20]): Decimal;
    procedure GetStrategyName(): Text[50];
}

// Standard pricing implementation
codeunit 50200 "Standard Pricing Strategy" implements "IPricing Strategy"
{
    procedure CalculatePrice(ItemNo: Code[20]; Quantity: Decimal; CustomerNo: Code[20]): Decimal
    var
        Item: Record Item;
        Price: Decimal;
    begin
        if Item.Get(ItemNo) then
            Price := Item."Unit Price"
        else
            Price := 0;
            
        // Apply standard pricing logic
        exit(Price * Quantity);
    end;
    
    procedure GetStrategyName(): Text[50]
    begin
        exit('Standard Pricing');
    end;
}

// Volume discount implementation
codeunit 50201 "Volume Discount Strategy" implements "IPricing Strategy"
{
    procedure CalculatePrice(ItemNo: Code[20]; Quantity: Decimal; CustomerNo: Code[20]): Decimal
    var
        Item: Record Item;
        DiscountPct: Decimal;
        BasePrice: Decimal;
    begin
        if Item.Get(ItemNo) then
            BasePrice := Item."Unit Price"
        else
            exit(0);
            
        // Volume-based discount logic
        case true of
            Quantity >= 100:
                DiscountPct := 0.15; // 15% discount
            Quantity >= 50:
                DiscountPct := 0.10; // 10% discount
            Quantity >= 20:
                DiscountPct := 0.05; // 5% discount
            else
                DiscountPct := 0;
        end;
        
        exit(BasePrice * Quantity * (1 - DiscountPct));
    end;
    
    procedure GetStrategyName(): Text[50]
    begin
        exit('Volume Discount');
    end;
}

// VIP customer implementation
codeunit 50202 "VIP Customer Strategy" implements "IPricing Strategy"
{
    procedure CalculatePrice(ItemNo: Code[20]; Quantity: Decimal; CustomerNo: Code[20]): Decimal
    var
        Item: Record Item;
        Customer: Record Customer;
        VIPDiscount: Decimal;
        BasePrice: Decimal;
    begin
        if not Item.Get(ItemNo) then
            exit(0);
            
        BasePrice := Item."Unit Price";
        VIPDiscount := 0.20; // 20% VIP discount
        
        if Customer.Get(CustomerNo) and (Customer."Customer Class Code" = 'VIP') then
            exit(BasePrice * Quantity * (1 - VIPDiscount))
        else
            exit(BasePrice * Quantity);
    end;
    
    procedure GetStrategyName(): Text[50]
    begin
        exit('VIP Customer Pricing');
    end;
}

// Pricing engine using strategies
codeunit 50203 "Pricing Engine"
{
    procedure CalculateLinePrice(SalesLine: Record "Sales Line"): Decimal
    var
        PricingStrategy: Interface "IPricing Strategy";
        Customer: Record Customer;
    begin
        // Select strategy based on customer type
        if Customer.Get(SalesLine."Sell-to Customer No.") then begin
            case Customer."Customer Class Code" of
                'VIP':
                    PricingStrategy := codeunit::"VIP Customer Strategy";
                'BULK':
                    PricingStrategy := codeunit::"Volume Discount Strategy";
                else
                    PricingStrategy := codeunit::"Standard Pricing Strategy";
            end;
        end else
            PricingStrategy := codeunit::"Standard Pricing Strategy";
            
        exit(PricingStrategy.CalculatePrice(SalesLine."No.", SalesLine.Quantity, SalesLine."Sell-to Customer No."));
    end;
}
```

## Pattern 2: Factory Pattern for Object Creation

### Use Case: Document Processing Factory

```al
interface "IDocument Processor"
{
    procedure ProcessDocument(DocumentNo: Code[20]): Boolean;
    procedure ValidateDocument(DocumentNo: Code[20]): Boolean;
    procedure GetProcessingStatus(DocumentNo: Code[20]): Text[50];
}

// Sales document processor
codeunit 50300 "Sales Document Processor" implements "IDocument Processor"
{
    procedure ProcessDocument(DocumentNo: Code[20]): Boolean
    var
        SalesHeader: Record "Sales Header";
    begin
        if not SalesHeader.Get(SalesHeader."Document Type"::Order, DocumentNo) then
            exit(false);
            
        // Sales-specific processing logic
        exit(ProcessSalesOrder(SalesHeader));
    end;
    
    procedure ValidateDocument(DocumentNo: Code[20]): Boolean
    var
        SalesHeader: Record "Sales Header";
    begin
        if not SalesHeader.Get(SalesHeader."Document Type"::Order, DocumentNo) then
            exit(false);
            
        // Sales validation logic
        exit(ValidateSalesOrder(SalesHeader));
    end;
    
    procedure GetProcessingStatus(DocumentNo: Code[20]): Text[50]
    begin
        // Return sales-specific status
        exit('Sales Order Processing');
    end;
    
    local procedure ProcessSalesOrder(var SalesHeader: Record "Sales Header"): Boolean
    begin
        // Implementation details...
        exit(true);
    end;
    
    local procedure ValidateSalesOrder(var SalesHeader: Record "Sales Header"): Boolean
    begin
        // Validation details...
        exit(true);
    end;
}

// Purchase document processor
codeunit 50301 "Purchase Document Processor" implements "IDocument Processor"
{
    procedure ProcessDocument(DocumentNo: Code[20]): Boolean
    var
        PurchaseHeader: Record "Purchase Header";
    begin
        if not PurchaseHeader.Get(PurchaseHeader."Document Type"::Order, DocumentNo) then
            exit(false);
            
        // Purchase-specific processing logic
        exit(ProcessPurchaseOrder(PurchaseHeader));
    end;
    
    procedure ValidateDocument(DocumentNo: Code[20]): Boolean
    var
        PurchaseHeader: Record "Purchase Header";
    begin
        if not PurchaseHeader.Get(PurchaseHeader."Document Type"::Order, DocumentNo) then
            exit(false);
            
        // Purchase validation logic
        exit(ValidatePurchaseOrder(PurchaseHeader));
    end;
    
    procedure GetProcessingStatus(DocumentNo: Code[20]): Text[50]
    begin
        exit('Purchase Order Processing');
    end;
    
    local procedure ProcessPurchaseOrder(var PurchaseHeader: Record "Purchase Header"): Boolean
    begin
        // Implementation details...
        exit(true);
    end;
    
    local procedure ValidatePurchaseOrder(var PurchaseHeader: Record "Purchase Header"): Boolean
    begin
        // Validation details...
        exit(true);
    end;
}

// Document factory
codeunit 50302 "Document Processor Factory"
{
    procedure CreateProcessor(DocumentType: Text[20]): Interface "IDocument Processor"
    begin
        case UpperCase(DocumentType) of
            'SALES':
                exit(codeunit::"Sales Document Processor");
            'PURCHASE':
                exit(codeunit::"Purchase Document Processor");
            else
                Error('Unknown document type: %1', DocumentType);
        end;
    end;
}

// Usage example
codeunit 50303 "Document Manager"
{
    procedure ProcessAnyDocument(DocumentType: Text[20]; DocumentNo: Code[20]): Boolean
    var
        ProcessorFactory: Codeunit "Document Processor Factory";
        Processor: Interface "IDocument Processor";
    begin
        Processor := ProcessorFactory.CreateProcessor(DocumentType);
        
        if Processor.ValidateDocument(DocumentNo) then
            exit(Processor.ProcessDocument(DocumentNo))
        else
            exit(false);
    end;
}
```

## Pattern 3: Observer Pattern for Event-Driven Architecture

### Use Case: Order Status Change Notifications

```al
interface "IOrder Status Observer"
{
    procedure OnOrderStatusChanged(OrderNo: Code[20]; OldStatus: Enum "Sales Document Status"; NewStatus: Enum "Sales Document Status");
}

// Email notification observer
codeunit 50400 "Email Notification Observer" implements "IOrder Status Observer"
{
    procedure OnOrderStatusChanged(OrderNo: Code[20]; OldStatus: Enum "Sales Document Status"; NewStatus: Enum "Sales Document Status")
    var
        EmailService: Codeunit "Email Service";
        SalesHeader: Record "Sales Header";
    begin
        if SalesHeader.Get(SalesHeader."Document Type"::Order, OrderNo) then
            case NewStatus of
                NewStatus::Released:
                    EmailService.SendOrderConfirmation(SalesHeader);
                NewStatus::"Pending Approval":
                    EmailService.SendApprovalRequest(SalesHeader);
                NewStatus::"Pending Prepayment":
                    EmailService.SendPaymentRequest(SalesHeader);
            end;
    end;
}

// Inventory observer
codeunit 50401 "Inventory Update Observer" implements "IOrder Status Observer"
{
    procedure OnOrderStatusChanged(OrderNo: Code[20]; OldStatus: Enum "Sales Document Status"; NewStatus: Enum "Sales Document Status")
    var
        InventoryService: Codeunit "Inventory Service";
    begin
        case NewStatus of
            NewStatus::Released:
                InventoryService.ReserveInventory(OrderNo);
            NewStatus::Open:
                if OldStatus = OldStatus::Released then
                    InventoryService.ReleaseReservation(OrderNo);
        end;
    end;
}

// Subject (Order Manager) that notifies observers
codeunit 50402 "Order Status Manager"
{
    var
        Observers: List of [Interface "IOrder Status Observer"];
    
    procedure AddObserver(Observer: Interface "IOrder Status Observer")
    begin
        Observers.Add(Observer);
    end;
    
    procedure RemoveObserver(Observer: Interface "IOrder Status Observer")
    var
        Index: Integer;
    begin
        Index := Observers.IndexOf(Observer);
        if Index > 0 then
            Observers.RemoveAt(Index);
    end;
    
    procedure ChangeOrderStatus(OrderNo: Code[20]; NewStatus: Enum "Sales Document Status")
    var
        SalesHeader: Record "Sales Header";
        OldStatus: Enum "Sales Document Status";
        Observer: Interface "IOrder Status Observer";
    begin
        if not SalesHeader.Get(SalesHeader."Document Type"::Order, OrderNo) then
            exit;
            
        OldStatus := SalesHeader.Status;
        
        // Update the status
        SalesHeader.Status := NewStatus;
        SalesHeader.Modify();
        
        // Notify all observers
        foreach Observer in Observers do
            Observer.OnOrderStatusChanged(OrderNo, OldStatus, NewStatus);
    end;
}
```

## Advanced Pattern: Dependency Injection Container

### Building a Simple DI Container for AL

```al
codeunit 50500 "Service Container"
{
    var
        Services: Dictionary of [Text, Interface];
        Singletons: Dictionary of [Text, Interface];
    
    procedure RegisterTransient(ServiceName: Text; Implementation: Interface)
    begin
        Services.Set(ServiceName, Implementation);
    end;
    
    procedure RegisterSingleton(ServiceName: Text; Implementation: Interface)
    begin
        Singletons.Set(ServiceName, Implementation);
    end;
    
    procedure Resolve(ServiceName: Text): Interface
    var
        Service: Interface;
    begin
        // Check singletons first
        if Singletons.ContainsKey(ServiceName) then
            exit(Singletons.Get(ServiceName));
            
        // Then check transient services
        if Services.ContainsKey(ServiceName) then
            exit(Services.Get(ServiceName));
            
        Error('Service %1 not registered', ServiceName);
    end;
    
    procedure IsRegistered(ServiceName: Text): Boolean
    begin
        exit(Services.ContainsKey(ServiceName) or Singletons.ContainsKey(ServiceName));
    end;
}

// Service registration
codeunit 50501 "Service Registration"
{
    procedure RegisterServices()
    var
        Container: Codeunit "Service Container";
    begin
        // Register pricing strategies
        Container.RegisterTransient('IPricingStrategy.Standard', codeunit::"Standard Pricing Strategy");
        Container.RegisterTransient('IPricingStrategy.Volume', codeunit::"Volume Discount Strategy");
        Container.RegisterTransient('IPricingStrategy.VIP', codeunit::"VIP Customer Strategy");
        
        // Register document processors
        Container.RegisterTransient('IDocumentProcessor.Sales', codeunit::"Sales Document Processor");
        Container.RegisterTransient('IDocumentProcessor.Purchase', codeunit::"Purchase Document Processor");
        
        // Register singletons
        Container.RegisterSingleton('OrderStatusManager', codeunit::"Order Status Manager");
    end;
}
```

## Testing with Interfaces

### Mock Implementation for Unit Testing

```al
codeunit 50600 "Mock Customer Validator" implements "ICustomer Validator"
{
    var
        MockValidationResult: Boolean;
        MockErrors: List of [Text];
    
    procedure SetMockResult(IsValid: Boolean; Errors: List of [Text])
    begin
        MockValidationResult := IsValid;
        MockErrors := Errors;
    end;
    
    procedure ValidateCustomer(CustomerNo: Code[20]): Boolean
    begin
        // Return predetermined result for testing
        exit(MockValidationResult);
    end;
    
    procedure GetValidationErrors(): List of [Text]
    begin
        exit(MockErrors);
    end;
}

// Test codeunit
codeunit 50601 "Order Processing Tests"
{
    [Test]
    procedure TestOrderProcessingWithInvalidCustomer()
    var
        OrderProcessor: Codeunit "Advanced Order Processing";
        MockValidator: Codeunit "Mock Customer Validator";
        MockInventory: Codeunit "Mock Inventory Service";
        MockNotification: Codeunit "Mock Notification Service";
        Errors: List of [Text];
        Result: Boolean;
    begin
        // Arrange
        Errors.Add('Customer credit limit exceeded');
        MockValidator.SetMockResult(false, Errors);
        
        OrderProcessor.SetDependencies(MockValidator, MockInventory, MockNotification);
        
        // Act
        Result := OrderProcessor.ProcessOrder('SO001');
        
        // Assert
        Assert.IsFalse(Result, 'Order processing should fail with invalid customer');
    end;
}
```

## Best Practices and Performance Considerations

### 1. Interface Design Guidelines

```al
// ✅ Good: Clear, focused interface
interface "IPayment Processor"
{
    procedure ProcessPayment(Amount: Decimal; PaymentMethod: Code[10]): Boolean;
    procedure ValidatePayment(Amount: Decimal; PaymentMethod: Code[10]): Boolean;
    procedure GetTransactionId(): Text[50];
}

// ❌ Bad: Too many responsibilities
interface "IEverythingService"
{
    procedure ProcessPayment(Amount: Decimal): Boolean;
    procedure SendEmail(Recipient: Text): Boolean;
    procedure CalculateTax(Amount: Decimal): Decimal;
    procedure GenerateReport(): Text;
}
```

### 2. Performance Optimization

- **Lazy Loading**: Initialize interfaces only when needed
- **Caching**: Cache interface instances for frequently used services
- **Resource Management**: Properly dispose of resources in implementations

### 3. Error Handling Patterns

```al
interface "IResult"
{
    procedure IsSuccess(): Boolean;
    procedure GetError(): Text;
    procedure GetValue(): Variant;
}

codeunit 50700 "Result Implementation" implements "IResult"
{
    var
        Success: Boolean;
        ErrorMessage: Text;
        Value: Variant;
    
    procedure SetSuccess(ResultValue: Variant)
    begin
        Success := true;
        Value := ResultValue;
        ErrorMessage := '';
    end;
    
    procedure SetError(Error: Text)
    begin
        Success := false;
        ErrorMessage := Error;
        Clear(Value);
    end;
    
    procedure IsSuccess(): Boolean
    begin
        exit(Success);
    end;
    
    procedure GetError(): Text
    begin
        exit(ErrorMessage);
    end;
    
    procedure GetValue(): Variant
    begin
        exit(Value);
    end;
}
```

## Real-World Example: E-commerce Integration

Here's how these patterns come together in a real-world scenario:

```al
// Complete e-commerce order processing system
codeunit 50800 "E-commerce Order Handler"
{
    var
        Container: Codeunit "Service Container";
        OrderStatusManager: Codeunit "Order Status Manager";
    
    procedure ProcessWebOrder(OrderData: JsonObject): Interface "IResult"
    var
        PricingEngine: Interface "IPricing Strategy";
        PaymentProcessor: Interface "IPayment Processor";
        InventoryService: Interface "IInventory Service";
        CustomerValidator: Interface "ICustomer Validator";
        Result: Codeunit "Result Implementation";
        SalesHeader: Record "Sales Header";
        OrderNo: Code[20];
    begin
        // Resolve services from container
        CustomerValidator := Container.Resolve('ICustomerValidator');
        PricingEngine := Container.Resolve('IPricingStrategy.Standard');
        PaymentProcessor := Container.Resolve('IPaymentProcessor.CreditCard');
        InventoryService := Container.Resolve('IInventoryService');
        
        // Process order using injected services
        if CreateSalesOrder(OrderData, SalesHeader) then begin
            if CustomerValidator.ValidateCustomer(SalesHeader."Sell-to Customer No.") and
               InventoryService.CheckAvailability(SalesHeader."No.") and
               PaymentProcessor.ProcessPayment(SalesHeader."Amount Including VAT", 'CARD') then
            begin
                OrderStatusManager.ChangeOrderStatus(SalesHeader."No.", SalesHeader.Status::Released);
                Result.SetSuccess(SalesHeader."No.");
            end else
                Result.SetError('Order processing failed during validation or payment');
        end else
            Result.SetError('Failed to create sales order');
            
        exit(Result);
    end;
}
```

## Conclusion: Building Scalable AL Architecture

Interfaces and advanced patterns transform AL development from rigid, tightly-coupled code into flexible, maintainable systems that adapt to change.

**Key benefits you'll achieve:**
- **Maintainable**: Changes isolated to specific implementations
- **Testable**: Easy mocking and unit testing
- **Scalable**: Add new implementations without touching existing code
- **Professional**: Enterprise-grade code quality

**Remember**: These patterns add complexity, so use them judiciously. Start simple and introduce patterns as your requirements grow.

*Ready to elevate your AL development skills? Check out my other advanced guides on [Performance Optimization](/insights/business-central-performance-bottlenecks-guide) and [Integration Patterns](/insights/mastering-api-integrations-business-central-external-services) to build world-class Business Central extensions.*
