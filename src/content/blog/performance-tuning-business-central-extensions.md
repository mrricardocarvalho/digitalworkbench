---
title: "Performance Tuning Your Business Central Extensions: Advanced Optimization Strategies"
description: "Comprehensive guide to optimizing Business Central extensions for maximum performance. Covers database queries, memory management, background processing, and monitoring techniques."
date: "2025-08-05"
readingTime: 13
featured: true
tags: ["Business Central", "Performance", "AL Development", "Optimization", "Database", "Memory Management"]
categories: ["Development", "Performance", "Advanced"]
author: "Ricardo Carvalho"
published: true
---

# Performance Tuning Your Business Central Extensions: Advanced Optimization Strategies

Extension performance can make or break user adoption. A slow extension frustrates users, impacts system resources, and reflects poorly on your development skills. But with the right optimization strategies, you can create **lightning-fast extensions** that users love and administrators appreciate. ⚡

This comprehensive guide reveals **advanced performance tuning techniques** used by top Business Central developers to build high-performance extensions that scale effortlessly.

## The Performance Foundation

### Understanding Performance Metrics

Before optimizing, you need to **measure what matters**:

- **Response Time**: How quickly operations complete
- **Throughput**: Number of operations per second
- **Resource Usage**: CPU, memory, and database consumption
- **User Experience**: Perceived performance and responsiveness
- **System Impact**: Effect on overall Business Central performance

### Performance Testing Framework

```al
codeunit 50200 "Performance Test Framework"
{
    var
        StartTime: DateTime;
        EndTime: DateTime;
        MemoryBefore: Integer;
        MemoryAfter: Integer;
        
    procedure StartPerformanceTest(TestName: Text)
    begin
        StartTime := CurrentDateTime();
        MemoryBefore := GetMemoryUsage();
        Message('Starting performance test: %1', TestName);
    end;
    
    procedure EndPerformanceTest(TestName: Text)
    var
        Duration: Duration;
        MemoryDelta: Integer;
    begin
        EndTime := CurrentDateTime();
        MemoryAfter := GetMemoryUsage();
        Duration := EndTime - StartTime;
        MemoryDelta := MemoryAfter - MemoryBefore;
        
        LogPerformanceMetrics(TestName, Duration, MemoryDelta);
        Message('Test completed: %1 | Duration: %2ms | Memory: %3KB', 
                TestName, Duration, MemoryDelta);
    end;
    
    local procedure GetMemoryUsage(): Integer
    begin
        // Implementation depends on available system functions
        exit(0); // Placeholder
    end;
}
```

## Database Query Optimization

### Efficient Record Navigation

**❌ Inefficient Pattern:**
```al
// Avoid: Multiple database hits
Customer.Reset();
if Customer.FindSet() then
    repeat
        SalesHeader.SetRange("Sell-to Customer No.", Customer."No.");
        if SalesHeader.FindFirst() then
            ProcessCustomerWithOrders(Customer, SalesHeader);
    until Customer.Next() = 0;
```

**✅ Optimized Pattern:**
```al
// Better: Single query with proper filtering
Customer.Reset();
Customer.SetLoadFields("No.", Name, "E-Mail"); // Only load needed fields
if Customer.FindSet() then
    repeat
        // Batch process customers
        ProcessCustomersBatch(Customer);
    until Customer.Next() = 0;
```

### Smart Field Loading

```al
codeunit 50201 "Optimized Data Loader"
{
    procedure LoadCustomersForReport(): List of [Record Customer]
    var
        Customer: Record Customer;
        CustomerList: List of [Record Customer];
    begin
        Customer.Reset();
        // Only load fields we actually need
        Customer.SetLoadFields("No.", Name, "Phone No.", "E-Mail", "Country/Region Code");
        
        if Customer.FindSet() then
            repeat
                CustomerList.Add(Customer);
            until Customer.Next() = 0;
            
        exit(CustomerList);
    end;
    
    procedure OptimizedCustomerLookup(SearchText: Text): List of [Record Customer]
    var
        Customer: Record Customer;
        CustomerList: List of [Record Customer];
    begin
        Customer.Reset();
        Customer.SetLoadFields("No.", Name); // Minimal fields for lookup
        Customer.SetFilter(Name, '@*%1*', SearchText);
        Customer.SetCurrentKey(Name); // Use appropriate index
        
        if Customer.FindSet() then
            repeat
                CustomerList.Add(Customer);
            until Customer.Next() = 0;
            
        exit(CustomerList);
    end;
}
```

### Bulk Operations

```al
codeunit 50202 "Bulk Data Processor"
{
    procedure BulkUpdateCustomers(CustomerNos: List of [Code[20]]; NewCreditLimit: Decimal)
    var
        Customer: Record Customer;
        CustomerNo: Code[20];
        UpdateCount: Integer;
    begin
        // Start transaction for bulk operation
        Customer.LockTable(); // Lock to prevent conflicts
        
        foreach CustomerNo in CustomerNos do begin
            if Customer.Get(CustomerNo) then begin
                Customer."Credit Limit (LCY)" := NewCreditLimit;
                Customer.Modify();
                UpdateCount += 1;
                
                // Commit every 100 records to avoid long transactions
                if UpdateCount mod 100 = 0 then
                    Commit();
            end;
        end;
        
        Message('Updated %1 customers successfully', UpdateCount);
    end;
    
    procedure BulkCreateSalesLines(SalesHeader: Record "Sales Header"; ItemLines: List of [Text])
    var
        SalesLine: Record "Sales Line";
        LineText: Text;
        LineNo: Integer;
        ItemNo: Code[20];
        Quantity: Decimal;
    begin
        LineNo := GetLastLineNo(SalesHeader) + 10000;
        
        foreach LineText in ItemLines do begin
            // Parse line data efficiently
            if ParseLineData(LineText, ItemNo, Quantity) then begin
                SalesLine.Init();
                SalesLine."Document Type" := SalesHeader."Document Type";
                SalesLine."Document No." := SalesHeader."No.";
                SalesLine."Line No." := LineNo;
                SalesLine.Type := SalesLine.Type::Item;
                SalesLine."No." := ItemNo;
                SalesLine.Quantity := Quantity;
                SalesLine.Insert(true); // Trigger field calculations
                
                LineNo += 10000;
            end;
        end;
    end;
}
```

## Memory Management

### Efficient Variable Usage

```al
codeunit 50203 "Memory Efficient Processor"
{
    // Use local variables instead of global when possible
    procedure ProcessLargeDataset(var TempData: Record "Integer" temporary)
    var
        ProcessingBuffer: Record "Integer" temporary; // Local temporary record
        Counter: Integer;
        BatchSize: Integer;
    begin
        BatchSize := 1000; // Process in batches to control memory
        
        TempData.Reset();
        if TempData.FindSet() then
            repeat
                ProcessingBuffer.Copy(TempData, true); // Copy to processing buffer
                Counter += 1;
                
                // Process batch and clear buffer
                if Counter mod BatchSize = 0 then begin
                    ProcessBatch(ProcessingBuffer);
                    ProcessingBuffer.Reset();
                    ProcessingBuffer.DeleteAll(); // Free memory
                end;
            until TempData.Next() = 0;
            
        // Process remaining records
        if not ProcessingBuffer.IsEmpty() then
            ProcessBatch(ProcessingBuffer);
    end;
    
    procedure OptimizedStringProcessing(InputTexts: List of [Text]) OutputTexts: List of [Text]
    var
        InputText: Text;
        ProcessedText: Text;
        TextBuilder: TextBuilder; // More efficient than string concatenation
    begin
        foreach InputText in InputTexts do begin
            // Use TextBuilder for efficient string operations
            TextBuilder.Clear();
            TextBuilder.Append('Processed: ');
            TextBuilder.Append(InputText);
            TextBuilder.Append(' - ');
            TextBuilder.Append(Format(CurrentDateTime()));
            
            ProcessedText := TextBuilder.ToText();
            OutputTexts.Add(ProcessedText);
        end;
    end;
}
```

### Resource Management

```al
codeunit 50204 "Resource Manager"
{
    var
        FileHandler: File;
        StreamHandler: InStream;
        IsResourceInitialized: Boolean;
        
    procedure InitializeResources(): Boolean
    begin
        if IsResourceInitialized then
            exit(true);
            
        // Initialize expensive resources once
        try
            // Setup file handlers, database connections, etc.
            IsResourceInitialized := true;
            exit(true);
        except
            CleanupResources();
            exit(false);
        end;
    end;
    
    procedure CleanupResources()
    begin
        // Always cleanup resources in finally blocks or destructors
        if FileHandler.IsOpen() then
            FileHandler.Close();
            
        Clear(StreamHandler);
        IsResourceInitialized := false;
    end;
    
    // Use pattern for automatic cleanup
    procedure ProcessFileWithCleanup(FileName: Text): Boolean
    var
        TempFile: File;
        ProcessingStream: InStream;
    begin
        try
            TempFile.Open(FileName);
            TempFile.CreateInStream(ProcessingStream);
            
            // Process file content
            exit(ProcessStreamContent(ProcessingStream));
        finally
            if TempFile.IsOpen() then
                TempFile.Close();
        end;
    end;
}
```

## Background Processing

### Job Queue Optimization

```al
codeunit 50205 "Optimized Background Processor"
{
    procedure QueueLargeDataProcessing(ProcessingType: Enum "Processing Type"; BatchSize: Integer)
    var
        JobQueueEntry: Record "Job Queue Entry";
        ParameterString: Text;
    begin
        // Create optimized job queue entries
        JobQueueEntry.Init();
        JobQueueEntry."Job Queue Category Code" := 'DATA-PROC';
        JobQueueEntry."Object Type to Run" := JobQueueEntry."Object Type to Run"::Codeunit;
        JobQueueEntry."Object ID to Run" := Codeunit::"Background Data Processor";
        
        // Pass parameters efficiently
        ParameterString := StrSubstNo('%1|%2|%3', ProcessingType, BatchSize, Format(CurrentDateTime()));
        JobQueueEntry."Parameter String" := CopyStr(ParameterString, 1, MaxStrLen(JobQueueEntry."Parameter String"));
        
        // Set optimal timing
        JobQueueEntry."Earliest Start Date/Time" := CurrentDateTime() + 5000; // 5 second delay
        JobQueueEntry."Maximum No. of Attempts to Run" := 3;
        JobQueueEntry."Rerun Delay (sec.)" := 300; // 5 minutes between retries
        
        JobQueueEntry.Insert(true);
    end;
    
    procedure ProcessInBackground(): Boolean
    var
        ProcessingQueue: Record "Processing Queue";
        ProcessedCount: Integer;
        StartTime: DateTime;
        ElapsedTime: Duration;
    begin
        StartTime := CurrentDateTime();
        
        ProcessingQueue.SetRange(Status, ProcessingQueue.Status::Pending);
        ProcessingQueue.SetCurrentKey("Priority", "Created DateTime"); // Process by priority
        
        if ProcessingQueue.FindSet(true) then
            repeat
                if ProcessSingleItem(ProcessingQueue) then begin
                    ProcessingQueue.Status := ProcessingQueue.Status::Completed;
                    ProcessingQueue."Completed DateTime" := CurrentDateTime();
                    ProcessingQueue.Modify();
                    ProcessedCount += 1;
                end;
                
                // Check time limits to avoid long-running jobs
                ElapsedTime := CurrentDateTime() - StartTime;
                if ElapsedTime > 1800000 then // 30 minutes max
                    break;
                    
            until ProcessingQueue.Next() = 0;
            
        Message('Background processing completed: %1 items processed', ProcessedCount);
        exit(ProcessedCount > 0);
    end;
}
```

### Asynchronous Operations

```al
codeunit 50206 "Async Operations Manager"
{
    procedure StartAsyncDataExport(FilterText: Text; ExportFormat: Text)
    var
        AsyncTask: Record "Async Task";
        TaskId: Guid;
    begin
        TaskId := CreateGuid();
        
        // Log async task start
        AsyncTask.Init();
        AsyncTask."Task ID" := TaskId;
        AsyncTask."Task Type" := 'DATA_EXPORT';
        AsyncTask.Status := AsyncTask.Status::Running;
        AsyncTask."Started DateTime" := CurrentDateTime();
        AsyncTask."User ID" := UserId();
        AsyncTask.Parameters := StrSubstNo('Filter: %1, Format: %2', FilterText, ExportFormat);
        AsyncTask.Insert();
        
        // Queue the actual export job
        QueueExportJob(TaskId, FilterText, ExportFormat);
        
        Message('Export started. Task ID: %1\Check status in Async Tasks page.', TaskId);
    end;
    
    procedure CheckAsyncTaskStatus(TaskId: Guid): Text
    var
        AsyncTask: Record "Async Task";
    begin
        if AsyncTask.Get(TaskId) then begin
            case AsyncTask.Status of
                AsyncTask.Status::Running:
                    exit('In Progress');
                AsyncTask.Status::Completed:
                    exit(StrSubstNo('Completed at %1', AsyncTask."Completed DateTime"));
                AsyncTask.Status::Failed:
                    exit(StrSubstNo('Failed: %1', AsyncTask."Error Message"));
                else
                    exit('Unknown');
            end;
        end else
            exit('Task not found');
    end;
}
```

## User Interface Optimization

### Efficient Page Loading

```al
page 50200 "Optimized Customer List"
{
    PageType = List;
    SourceTable = Customer;
    UsageCategory = Lists;
    ApplicationArea = All;
    
    layout
    {
        area(Content)
        {
            repeater(CustomerList)
            {
                field("No."; Rec."No.")
                {
                    ApplicationArea = All;
                }
                field(Name; Rec.Name)
                {
                    ApplicationArea = All;
                }
                // Load only essential fields initially
                field("Phone No."; Rec."Phone No.")
                {
                    ApplicationArea = All;
                    Visible = ShowPhoneNumbers; // Conditional visibility
                }
                field("Credit Limit (LCY)"; Rec."Credit Limit (LCY)")
                {
                    ApplicationArea = All;
                    Visible = ShowFinancialData;
                }
            }
        }
    }
    
    actions
    {
        area(Processing)
        {
            action(LoadAdditionalData)
            {
                Caption = 'Load Additional Data';
                ApplicationArea = All;
                
                trigger OnAction()
                begin
                    // Load additional data on demand
                    ShowPhoneNumbers := true;
                    ShowFinancialData := true;
                    CurrPage.Update(false);
                end;
            }
        }
    }
    
    trigger OnOpenPage()
    begin
        // Set optimal filters and sorting
        Rec.SetCurrentKey(Name);
        
        // Apply performance-friendly filters
        if not ShowAllCustomers then
            Rec.SetFilter("Date Filter", '%1..%2', CalcDate('-1Y', WorkDate()), WorkDate());
    end;
    
    var
        ShowPhoneNumbers: Boolean;
        ShowFinancialData: Boolean;
        ShowAllCustomers: Boolean;
}
```

### Smart Data Loading

```al
codeunit 50207 "Smart Data Loader"
{
    procedure LoadPageData(PageRef: PageRef; LoadLevel: Option Basic,Standard,Detailed)
    var
        RecRef: RecordRef;
        FieldRef: FieldRef;
        FieldList: List of [Integer];
    begin
        RecRef := PageRef.GetRecord();
        
        // Define field sets based on load level
        case LoadLevel of
            LoadLevel::Basic:
                FieldList := GetBasicFields(RecRef.Number());
            LoadLevel::Standard:
                FieldList := GetStandardFields(RecRef.Number());
            LoadLevel::Detailed:
                FieldList := GetAllFields(RecRef.Number());
        end;
        
        // Set load fields for performance
        SetLoadFields(RecRef, FieldList);
    end;
    
    local procedure GetBasicFields(TableNo: Integer) FieldList: List of [Integer]
    begin
        // Return minimal field set for initial load
        case TableNo of
            Database::Customer:
                begin
                    FieldList.Add(1); // No.
                    FieldList.Add(2); // Name
                    FieldList.Add(3); // Search Name
                end;
            Database::Item:
                begin
                    FieldList.Add(1); // No.
                    FieldList.Add(3); // Description
                    FieldList.Add(31); // Unit Price
                end;
        end;
    end;
}
```

## Real-time Monitoring

### Performance Monitoring Dashboard

```al
page 50201 "Performance Monitor"
{
    PageType = Card;
    SourceTable = "Performance Metrics";
    UsageCategory = Administration;
    ApplicationArea = All;
    RefreshOnActivate = true;
    
    layout
    {
        area(Content)
        {
            group(CurrentMetrics)
            {
                Caption = 'Current Performance Metrics';
                
                field("Average Response Time"; Rec."Average Response Time")
                {
                    ApplicationArea = All;
                    StyleExpr = ResponseTimeStyle;
                }
                field("Memory Usage MB"; Rec."Memory Usage MB")
                {
                    ApplicationArea = All;
                    StyleExpr = MemoryUsageStyle;
                }
                field("Active Sessions"; Rec."Active Sessions")
                {
                    ApplicationArea = All;
                }
                field("Database Connections"; Rec."Database Connections")
                {
                    ApplicationArea = All;
                    StyleExpr = DbConnectionStyle;
                }
            }
            
            group(Trends)
            {
                Caption = 'Performance Trends';
                
                field("Hourly Throughput"; Rec."Hourly Throughput")
                {
                    ApplicationArea = All;
                }
                field("Error Rate Percentage"; Rec."Error Rate Percentage")
                {
                    ApplicationArea = All;
                    StyleExpr = ErrorRateStyle;
                }
            }
        }
    }
    
    trigger OnAfterGetRecord()
    begin
        UpdateStyleExpressions();
    end;
    
    local procedure UpdateStyleExpressions()
    begin
        // Dynamic styling based on performance thresholds
        if Rec."Average Response Time" > 2000 then
            ResponseTimeStyle := 'Unfavorable'
        else if Rec."Average Response Time" > 1000 then
            ResponseTimeStyle := 'Ambiguous'
        else
            ResponseTimeStyle := 'Favorable';
            
        if Rec."Memory Usage MB" > 1000 then
            MemoryUsageStyle := 'Unfavorable'
        else
            MemoryUsageStyle := 'Favorable';
            
        if Rec."Error Rate Percentage" > 5 then
            ErrorRateStyle := 'Unfavorable'
        else if Rec."Error Rate Percentage" > 1 then
            ErrorRateStyle := 'Ambiguous'
        else
            ErrorRateStyle := 'Favorable';
    end;
    
    var
        ResponseTimeStyle: Text;
        MemoryUsageStyle: Text;
        DbConnectionStyle: Text;
        ErrorRateStyle: Text;
}
```

### Automated Performance Alerts

```al
codeunit 50208 "Performance Alert Manager"
{
    procedure CheckPerformanceThresholds()
    var
        PerformanceMetrics: Record "Performance Metrics";
        AlertLevel: Option Normal,Warning,Critical;
    begin
        if PerformanceMetrics.Get() then begin
            // Check response time
            if PerformanceMetrics."Average Response Time" > 5000 then
                SendAlert('Critical response time detected', AlertLevel::Critical)
            else if PerformanceMetrics."Average Response Time" > 2000 then
                SendAlert('High response time detected', AlertLevel::Warning);
                
            // Check memory usage
            if PerformanceMetrics."Memory Usage MB" > 2000 then
                SendAlert('High memory usage detected', AlertLevel::Critical)
            else if PerformanceMetrics."Memory Usage MB" > 1000 then
                SendAlert('Elevated memory usage', AlertLevel::Warning);
                
            // Check error rates
            if PerformanceMetrics."Error Rate Percentage" > 10 then
                SendAlert('High error rate detected', AlertLevel::Critical)
            else if PerformanceMetrics."Error Rate Percentage" > 5 then
                SendAlert('Increased error rate', AlertLevel::Warning);
        end;
    end;
    
    local procedure SendAlert(AlertMessage: Text; Level: Option Normal,Warning,Critical)
    var
        AlertLog: Record "Alert Log";
        EmailMessage: Codeunit "Email Message";
        Email: Codeunit Email;
    begin
        // Log alert
        AlertLog.Init();
        AlertLog."Alert DateTime" := CurrentDateTime();
        AlertLog.Message := CopyStr(AlertMessage, 1, MaxStrLen(AlertLog.Message));
        AlertLog.Level := Level;
        AlertLog."User ID" := UserId();
        AlertLog.Insert();
        
        // Send email notification for critical alerts
        if Level = Level::Critical then begin
            EmailMessage.Create('admin@company.com', 
                              'Performance Alert - Business Central',
                              StrSubstNo('Critical performance issue detected: %1\nTime: %2', 
                                        AlertMessage, CurrentDateTime()));
            Email.Send(EmailMessage);
        end;
    end;
}
```

## Caching Strategies

### Smart Caching Implementation

```al
codeunit 50209 "Performance Cache Manager"
{
    var
        CacheStorage: Dictionary of [Text, Text];
        CacheTimestamps: Dictionary of [Text, DateTime];
        CacheTimeout: Duration;
        
    procedure Initialize()
    begin
        CacheTimeout := 300000; // 5 minutes default
    end;
    
    procedure GetCachedValue(CacheKey: Text; var CachedValue: Text): Boolean
    var
        CacheTime: DateTime;
    begin
        if not CacheStorage.ContainsKey(CacheKey) then
            exit(false);
            
        // Check if cache is still valid
        CacheTime := CacheTimestamps.Get(CacheKey);
        if (CurrentDateTime() - CacheTime) > CacheTimeout then begin
            RemoveFromCache(CacheKey);
            exit(false);
        end;
        
        CachedValue := CacheStorage.Get(CacheKey);
        exit(true);
    end;
    
    procedure SetCachedValue(CacheKey: Text; Value: Text)
    begin
        CacheStorage.Set(CacheKey, Value);
        CacheTimestamps.Set(CacheKey, CurrentDateTime());
    end;
    
    procedure GetCustomerWithCache(CustomerNo: Code[20]; var Customer: Record Customer): Boolean
    var
        CacheKey: Text;
        CachedData: Text;
        CustomerJson: JsonObject;
    begin
        CacheKey := StrSubstNo('CUSTOMER_%1', CustomerNo);
        
        // Try to get from cache first
        if GetCachedValue(CacheKey, CachedData) then begin
            if DeserializeCustomer(CachedData, Customer) then
                exit(true);
        end;
        
        // Load from database and cache
        if Customer.Get(CustomerNo) then begin
            CachedData := SerializeCustomer(Customer);
            SetCachedValue(CacheKey, CachedData);
            exit(true);
        end;
        
        exit(false);
    end;
    
    procedure ClearExpiredCache()
    var
        KeysToRemove: List of [Text];
        CacheKey: Text;
        CacheTime: DateTime;
    begin
        foreach CacheKey in CacheTimestamps.Keys() do begin
            CacheTime := CacheTimestamps.Get(CacheKey);
            if (CurrentDateTime() - CacheTime) > CacheTimeout then
                KeysToRemove.Add(CacheKey);
        end;
        
        foreach CacheKey in KeysToRemove do
            RemoveFromCache(CacheKey);
    end;
}
```

## Performance Testing Automation

### Automated Performance Tests

```al
codeunit 50210 "Automated Performance Tests"
{
    procedure RunCustomerPerformanceTest(): Boolean
    var
        Customer: Record Customer;
        TestFramework: Codeunit "Performance Test Framework";
        TestCount: Integer;
        PassedTests: Integer;
    begin
        // Test 1: Bulk customer creation
        TestFramework.StartPerformanceTest('Bulk Customer Creation');
        if TestBulkCustomerCreation(1000) then
            PassedTests += 1;
        TestFramework.EndPerformanceTest('Bulk Customer Creation');
        TestCount += 1;
        
        // Test 2: Customer search performance
        TestFramework.StartPerformanceTest('Customer Search');
        if TestCustomerSearchPerformance() then
            PassedTests += 1;
        TestFramework.EndPerformanceTest('Customer Search');
        TestCount += 1;
        
        // Test 3: Customer report generation
        TestFramework.StartPerformanceTest('Customer Report');
        if TestCustomerReportGeneration() then
            PassedTests += 1;
        TestFramework.EndPerformanceTest('Customer Report');
        TestCount += 1;
        
        Message('Performance tests completed: %1/%2 passed', PassedTests, TestCount);
        exit(PassedTests = TestCount);
    end;
    
    local procedure TestBulkCustomerCreation(NumberOfCustomers: Integer): Boolean
    var
        Customer: Record Customer;
        StartTime: DateTime;
        EndTime: DateTime;
        Duration: Duration;
        i: Integer;
    begin
        StartTime := CurrentDateTime();
        
        for i := 1 to NumberOfCustomers do begin
            Customer.Init();
            Customer."No." := StrSubstNo('PERF%1', i);
            Customer.Name := StrSubstNo('Performance Test Customer %1', i);
            Customer.Insert();
        end;
        
        EndTime := CurrentDateTime();
        Duration := EndTime - StartTime;
        
        // Test should complete within 30 seconds for 1000 customers
        exit(Duration < 30000);
    end;
    
    local procedure TestCustomerSearchPerformance(): Boolean
    var
        Customer: Record Customer;
        StartTime: DateTime;
        EndTime: DateTime;
        Duration: Duration;
        FoundCount: Integer;
    begin
        StartTime := CurrentDateTime();
        
        Customer.Reset();
        Customer.SetFilter(Name, '@*Test*');
        if Customer.FindSet() then
            repeat
                FoundCount += 1;
            until Customer.Next() = 0;
            
        EndTime := CurrentDateTime();
        Duration := EndTime - StartTime;
        
        // Search should complete within 5 seconds
        exit((Duration < 5000) and (FoundCount > 0));
    end;
}
```

## Key Performance Patterns

### 🚀 **Do These Things**
1. **Use SetLoadFields()** for large record sets
2. **Implement proper caching** for frequently accessed data
3. **Process data in batches** to avoid memory issues
4. **Use background jobs** for heavy operations
5. **Monitor and alert** on performance metrics
6. **Test performance** regularly with realistic data volumes

### ❌ **Avoid These Pitfalls**
1. **N+1 query problems** - Use proper joins and filtering
2. **Loading unnecessary fields** - Always use SetLoadFields
3. **Long-running transactions** - Break up large operations
4. **Memory leaks** - Clean up temporary records and variables
5. **Blocking UI operations** - Move heavy work to background
6. **Ignoring indexes** - Use appropriate SetCurrentKey calls

## Performance Monitoring Checklist

### Daily Monitoring
- [ ] Check average response times
- [ ] Monitor memory usage trends
- [ ] Review error rates
- [ ] Validate background job completion

### Weekly Analysis
- [ ] Analyze performance trends
- [ ] Review slow-running operations
- [ ] Check cache hit rates
- [ ] Validate database query performance

### Monthly Optimization
- [ ] Run performance test suite
- [ ] Review and optimize slow queries
- [ ] Update caching strategies
- [ ] Plan infrastructure scaling

## What's Next? 🎯

Advanced optimization techniques to explore:

- **Database partitioning** for large datasets
- **Microservice architecture** for complex integrations
- **AI-powered performance predictions** for proactive optimization
- **Container optimization** for cloud deployments
- **Edge caching strategies** for global deployments

## Key Takeaways

1. **Measure before optimizing** - Use proper performance testing
2. **Database efficiency** is critical for overall performance
3. **Memory management** prevents system degradation
4. **Background processing** keeps UI responsive
5. **Monitoring and alerting** enable proactive optimization
6. **Regular testing** ensures performance doesn't regress

Ready to build lightning-fast extensions? Start with database optimization and gradually implement these advanced patterns for maximum performance impact.

For more optimization strategies, check out our guides on [Mastering API Integrations](/insights/mastering-api-integrations-business-central-external-services) and [Automating Tests for Copilot Extensions](/insights/automating-tests-copilot-extensions-business-central).

---

*Need help optimizing your Business Central extensions? I specialize in performance tuning and scalability solutions! Reach out at [ricardo.sampaio@gmail.com](mailto:ricardo.sampaio@gmail.com) or connect on [LinkedIn](https://www.linkedin.com/in/ricardo-carvalho-05741519).* ⚡
