# VetPMS Integration Strategy

## Table of Contents

1. [Overview](#overview)
2. [Integration Architecture](#integration-architecture)
3. [Backend Integration Strategy](#backend-integration-strategy)
4. [n8n Workflow Automation](#n8n-workflow-automation)
5. [External System Integrations](#external-system-integrations)
6. [Security and Multi-Tenancy](#security-and-multi-tenancy)
7. [Migration Path](#migration-path)
8. [Implementation Roadmap](#implementation-roadmap)

## Overview

The VetPMS Integration Strategy provides a comprehensive approach to connecting the VetPMS system with various external systems, services, and data sources. This strategy enables a phased development approach, starting with a temporary backend solution while building toward the final architecture, all while maintaining robust integration capabilities throughout the transition.

### Core Integration Principles

1. **API-First Design**: All system components communicate through well-defined APIs
2. **Decoupled Architecture**: Loose coupling between systems to enable independent evolution
3. **Workflow Automation**: Use n8n as the primary workflow automation engine
4. **Progressive Migration**: Phased approach to moving from temporary to final backend
5. **Multi-Tenant Isolation**: Maintain data isolation across all integration points

## Integration Architecture

### High-Level Integration Landscape

```
┌────────────────┐     ┌──────────────────┐     ┌────────────────────┐
│                │     │                  │     │                    │
│  React         │     │  Backend APIs    │     │  External Systems  │
│  Frontend      │◄────┤  (Temp/Final)    │◄────┤                    │
│                │     │                  │     │                    │
└────────────────┘     └──────────────────┘     └────────────────────┘
        ▲                       ▲                         ▲
        │                       │                         │
        │                       │                         │
        │                       ▼                         │
        │               ┌──────────────────┐              │
        └───────────────┤                  ├──────────────┘
                        │  n8n Workflows   │
                        │                  │
                        └──────────────────┘
```

### Integration Hub Architecture

The Integration Hub serves as the central coordination point for connecting VetPMS with external systems. It provides:

1. **Connector Registry**: Central repository of all available connectors
2. **Protocol Adapters**: Translation between different communication protocols
3. **Authentication Management**: Secure handling of credentials for external systems
4. **Circuit Breakers**: Fault tolerance for external system failures
5. **Error Handling**: Consistent error management across integrations

#### Integration Hub Implementation

```csharp
public interface IIntegrationHub
{
    Task<IConnector> GetConnectorAsync(string connectorType, Guid tenantId);
    Task<TResult> ExecuteIntegrationAsync<TResult>(IntegrationRequest request);
    Task RegisterConnectorAsync(ConnectorRegistration registration);
}

public class IntegrationHub : IIntegrationHub
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IConnectorRegistry _registry;
    private readonly ICircuitBreakerPolicy _circuitBreaker;
    private readonly ILogger<IntegrationHub> _logger;

    public async Task<IConnector> GetConnectorAsync(string connectorType, Guid tenantId)
    {
        var registration = await _registry.GetRegistrationAsync(connectorType);
        var connector = _serviceProvider.GetRequiredService(registration.ConnectorType) as IConnector;

        await connector.InitializeAsync(tenantId);
        return connector;
    }

    public async Task<TResult> ExecuteIntegrationAsync<TResult>(IntegrationRequest request)
    {
        return await _circuitBreaker.ExecuteAsync(async () =>
        {
            var connector = await GetConnectorAsync(request.ConnectorType, request.TenantId);

            try
            {
                var result = await connector.ExecuteAsync<TResult>(request);
                await LogIntegrationAsync(request, result, success: true);
                return result;
            }
            catch (Exception ex)
            {
                await LogIntegrationAsync(request, ex, success: false);
                throw;
            }
        });
    }
}
```

## Backend Integration Strategy

### Development Approach Options

We evaluated three potential approaches for VetPMS backend development:

1. **Direct to Final Backend**: Build complete .NET backend from the start
   - Pros: No migration needed, clean architecture
   - Cons: Longer time to market, higher initial complexity

2. **Temporary Backend with Migration Path**: Start with BaaS solution, migrate to .NET
   - Pros: Faster MVP, progressive development, deferred complexity
   - Cons: Migration effort, potential technical debt

3. **Hybrid Backend**: Use .NET for core features, BaaS for auxiliary features
   - Pros: Optimized development, balance of control and speed
   - Cons: Increased integration complexity, dual maintenance

**Selected Approach**: Option 2 - Temporary Backend with Migration Path

### Temporary Backend Solution: Supabase

After evaluating several backend-as-a-service (BaaS) options, we selected Supabase as our temporary backend solution:

| Feature | Supabase | Firebase | Strapi | Appwrite |
|---------|----------|----------|--------|----------|
| **Multi-tenancy** | ✅ Strong | ⚠️ Limited | ⚠️ Requires setup | ✅ Strong |
| **Role-based access** | ✅ Row-level security | ✅ Good | ✅ Excellent | ✅ Good |
| **Migration path** | ✅ PostgreSQL export | ⚠️ Limited | ✅ Headless CMS | ✅ Good |
| **Refine.dev integration** | ✅ Official adapter | ✅ Official adapter | ✅ Official adapter | ⚠️ Community adapter |
| **Self-hostable** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **Real-time capabilities** | ✅ Yes | ✅ Yes | ⚠️ Limited | ✅ Yes |
| **TypeScript support** | ✅ Excellent | ⚠️ Moderate | ✅ Good | ✅ Good |

#### Supabase Multi-Tenant Setup

```sql
-- Create schema for each tenant
CREATE SCHEMA IF NOT EXISTS tenant_${tenant_id};

-- Create tables in tenant schema
CREATE TABLE tenant_${tenant_id}.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  owner_id UUID NOT NULL REFERENCES tenant_${tenant_id}.owners(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security for multi-tenancy
ALTER TABLE tenant_${tenant_id}.patients ENABLE ROW LEVEL SECURITY;

-- Policy for access control based on role
CREATE POLICY "Allow veterinarians to read all patients"
  ON tenant_${tenant_id}.patients
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('veterinarian', 'manager', 'admin'));
```

### Final Backend: ASP.NET Core with Clean Architecture

The final backend will be implemented with ASP.NET Core following Clean Architecture principles:

1. **Domain Layer**: Core business logic and entities
2. **Application Layer**: Use cases, DTOs, and interfaces
3. **Infrastructure Layer**: External services, database, integrations
4. **Presentation Layer**: API controllers and endpoints

#### Integration Controller Example

```csharp
[ApiController]
[Route("api/[controller]")]
public class IntegrationsController : ControllerBase
{
    private readonly IIntegrationHub _integrationHub;
    private readonly IMapper _mapper;

    [HttpPost("{connectorType}/execute")]
    [Authorize(Policy = "IntegrationPolicy")]
    public async Task<IActionResult> ExecuteIntegration(
        string connectorType,
        [FromBody] IntegrationRequestDto requestDto)
    {
        var tenantId = HttpContext.GetTenantId();
        var request = _mapper.Map<IntegrationRequest>(requestDto);
        request.ConnectorType = connectorType;
        request.TenantId = tenantId;

        var result = await _integrationHub.ExecuteIntegrationAsync<object>(request);
        return Ok(result);
    }
}
```

### Frontend Integration with Refine.dev

To enable a smooth transition from temporary to final backend, we'll use Refine.dev as a frontend data layer:

```tsx
// Refine.dev integration
import { Refine } from "@refinedev/core";
import routerBindings from "@refinedev/react-router-v6";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { supabaseDataProvider } from "@refinedev/supabase";
import { authProvider } from "./authProvider";

function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={supabaseDataProvider(supabaseClient)}
        authProvider={authProvider}
        routerProvider={routerBindings}
        resources={[
          {
            name: "patients",
            list: "/patients",
            show: "/patients/:id",
            create: "/patients/create",
            edit: "/patients/:id/edit",
          },
          // Other resources
        ]}
      >
        <Routes>
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          {/* Other routes */}
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}
```

## n8n Workflow Automation

n8n serves as the automation and integration layer in the VetPMS architecture, enabling workflows that connect various systems and automate processes.

### Workflow Categories

1. **Client Communication Workflows**
   - Appointment reminders
   - Follow-up notifications
   - Vaccination reminders
   - Prescription refill notifications

2. **Clinical Workflows**
   - Lab result processing
   - Medical record alerts
   - Treatment protocol automation
   - Medication inventory alerts

3. **Business Workflows**
   - Invoice generation
   - Payment processing
   - Reporting automation
   - Staff scheduling notifications

4. **Data Integration Workflows**
   - Third-party lab integration
   - Supplier inventory synchronization
   - External pharmacy integration
   - Practice management software integration

### Workflow Trigger Pattern

```typescript
// lib/api/services/workflowService.ts
import apiClient from '../apiClient';

export const WorkflowService = {
  triggerWorkflow: async (workflowKey: string, payload: any) => {
    const response = await apiClient.post(`/workflows/${workflowKey}/trigger`, payload);
    return response.data;
  },
  
  getWorkflowStatus: async (executionId: string) => {
    const response = await apiClient.get(`/workflows/executions/${executionId}`);
    return response.data;
  },
};

// Custom hook for triggering workflows
export function useTriggerWorkflow() {
  const { currentTenant } = useTenant();
  
  return useMutation({
    mutationFn: ({ workflowKey, payload }: { workflowKey: string; payload: any }) => {
      return WorkflowService.triggerWorkflow(workflowKey, {
        ...payload,
        tenantId: currentTenant?.id,
      });
    },
  });
}
```

### n8n Integration with Backends

#### Supabase Integration

```javascript
// n8n Supabase node configuration
{
  "nodes": [
    {
      "parameters": {
        "operation": "select",
        "table": "appointments",
        "schema": "tenant_${tenant_id}",
        "filter": "{ \"date\": { \"_gt\": \"{{$today}}\" } }"
      },
      "name": "Supabase",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [380, 260]
    }
  ]
}
```

#### ASP.NET Core Integration

```csharp
// WorkflowController.cs
[ApiController]
[Route("api/[controller]")]
public class WorkflowController : ControllerBase
{
    [HttpGet("appointments/upcoming")]
    [ApiKey] // Custom attribute for n8n authentication
    public async Task<IActionResult> GetUpcomingAppointments([FromQuery] DateTime date)
    {
        // Implementation
        return Ok(appointments);
    }
    
    [HttpPost("notification/send")]
    [ApiKey]
    public async Task<IActionResult> SendNotification([FromBody] NotificationRequest request)
    {
        // Implementation
        return Ok();
    }
}
```

### Workflow Security

```csharp
// ApiKeyAuthHandler.cs
public class ApiKeyAuthHandler : AuthenticationHandler<ApiKeyAuthOptions>
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("X-API-Key", out var apiKeyHeaderValues))
        {
            return Task.FromResult(AuthenticateResult.Fail("API Key not provided"));
        }

        var apiKey = apiKeyHeaderValues.FirstOrDefault();
        
        if (string.IsNullOrEmpty(apiKey))
        {
            return Task.FromResult(AuthenticateResult.Fail("API Key not provided"));
        }

        if (!_apiKeyValidator.IsValid(apiKey))
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid API Key"));
        }

        var tenant = _apiKeyValidator.GetTenantForApiKey(apiKey);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "n8n"),
            new Claim("tenant_id", tenant.Id.ToString())
        };

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
```

## External System Integrations

### Laboratory Integration

```csharp
public class LaboratoryConnector : BaseConnector, ILaboratoryConnector
{
    public async Task<LabResult> SubmitLabOrderAsync(LabOrder order)
    {
        var request = new IntegrationRequest
        {
            Operation = "SubmitOrder",
            Parameters = new Dictionary<string, object>
            {
                ["order"] = order
            }
        };

        return await ExecuteAsync<LabResult>(request);
    }

    public async Task<List<LabResult>> GetPendingResultsAsync()
    {
        var request = new IntegrationRequest
        {
            Operation = "GetPendingResults"
        };

        return await ExecuteAsync<List<LabResult>>(request);
    }

    public async Task ProcessLabResultAsync(LabResult result)
    {
        // Update patient record
        var medicalRecord = await _medicalRecordService.GetByIdAsync(result.MedicalRecordId);
        medicalRecord.AddLabResult(result);

        // Notify veterinarian
        await _notificationService.SendLabResultNotificationAsync(
            medicalRecord.VeterinarianId,
            result);

        // Check for critical values
        if (result.HasCriticalValues)
        {
            await _alertService.CreateCriticalLabAlertAsync(result);
        }
    }
}
```

### Payment Gateway Integration

```csharp
public class PaymentGatewayService : IPaymentGatewayService
{
    private readonly IPaymentProviderFactory _providerFactory;
    private readonly IInvoiceService _invoiceService;
    private readonly IAuditLogger _auditLogger;

    public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)
    {
        var provider = _providerFactory.GetProvider(request.PaymentMethod);

        try {
            // Validate payment request
            await ValidatePaymentRequestAsync(request);

            // Process payment
            var result = await provider.ProcessPaymentAsync(request);

            // Update invoice
            if (result.Success)
            {
                await _invoiceService.RecordPaymentAsync(request.InvoiceId, result);
            }

            // Audit log
            await _auditLogger.LogPaymentAsync(request, result);

            return result;
        }
        catch (Exception ex)
        {
            await _auditLogger.LogPaymentErrorAsync(request, ex);
            throw;
        }
    }
}
```

### Client Communication Integration

```csharp
public class CommunicationService : ICommunicationService
{
    private readonly IEmailProvider _emailProvider;
    private readonly ISmsProvider _smsProvider;
    private readonly ITemplateEngine _templateEngine;
    private readonly IClientPreferenceService _preferenceService;

    public async Task SendAppointmentReminderAsync(Appointment appointment)
    {
        var client = await _clientService.GetByIdAsync(appointment.ClientId);
        var preferences = await _preferenceService.GetClientPreferencesAsync(client.Id);

        var context = new ReminderContext
        {
            ClientName = client.FullName,
            PatientName = appointment.Patient.Name,
            AppointmentTime = appointment.ScheduledStart,
            ClinicInfo = await GetClinicInfoAsync(appointment.TenantId)
        };

        if (preferences.EnableEmailReminders)
        {
            var emailContent = await _templateEngine.RenderAsync(
                "AppointmentReminder",
                context);

            await _emailProvider.SendAsync(new EmailMessage
            {
                To = client.Email,
                Subject = "Appointment Reminder",
                Body = emailContent,
                IsHtml = true
            });
        }

        if (preferences.EnableSmsReminders)
        {
            var smsContent = await _templateEngine.RenderAsync(
                "AppointmentReminderSms",
                context);

            await _smsProvider.SendAsync(new SmsMessage
            {
                To = client.PhoneNumber,
                Content = smsContent
            });
        }
    }
}
```

## Security and Multi-Tenancy

### API Security

```csharp
public class IntegrationSecurityService : IIntegrationSecurityService
{
    private readonly ISecretManager _secretManager;
    private readonly IEncryptionService _encryptionService;

    public async Task<string> GetSecureCredentialAsync(string integrationName, string credentialKey)
    {
        var secretKey = $"{integrationName}_{credentialKey}";
        var encryptedValue = await _secretManager.GetSecretAsync(secretKey);

        return _encryptionService.Decrypt(encryptedValue);
    }

    public async Task ValidateIntegrationRequestAsync(IntegrationRequest request)
    {
        // Validate tenant access
        if (!await HasTenantAccessAsync(request.TenantId, request.ConnectorType))
        {
            throw new UnauthorizedAccessException("Tenant not authorized for this integration");
        }

        // Validate API limits
        if (!await CheckApiLimitsAsync(request.TenantId, request.ConnectorType))
        {
            throw new RateLimitExceededException("API rate limit exceeded");
        }
    }
}
```

### Multi-Tenant Workflow Strategy

1. **Include Tenant ID in all workflow payloads**

```typescript
const { currentTenant } = useTenant();

triggerWorkflow({
  workflowKey: 'workflow-key',
  payload: {
    // Other payload data
    tenantId: currentTenant?.id,
  },
});
```

2. **Validate Tenant ID in webhook handlers**

```csharp
public async Task<IActionResult> HandleWebhook([FromBody] WebhookPayload payload)
{
    // Extract tenant ID from payload
    string tenantId = payload.TenantId;
    
    // Validate current user has access to this tenant
    if (!await _tenantService.UserHasAccessToTenant(User, tenantId))
    {
        return Forbid();
    }
    
    // Process webhook
    // ...
}
```

### Tenant-Specific Configurations

```csharp
public async Task<WorkflowConfiguration> GetWorkflowConfigurationAsync(
    string workflowKey, string tenantId)
{
    // Get base configuration
    var baseConfig = await _workflowConfigRepository.GetBaseConfigurationAsync(workflowKey);
    
    // Get tenant-specific overrides
    var tenantOverrides = await _workflowConfigRepository.GetTenantOverridesAsync(workflowKey, tenantId);
    
    // Merge configurations
    return new WorkflowConfiguration
    {
        // Apply tenant overrides over base configuration
        Key = baseConfig.Key,
        Settings = baseConfig.Settings.MergeWith(tenantOverrides?.Settings),
        Enabled = tenantOverrides?.Enabled ?? baseConfig.Enabled
    };
}
```

## Migration Path

### Data Migration Strategy

```csharp
public class AnimanaMigrationService
{
    private readonly IAnimanaConnector _animanaConnector;
    private readonly TenantDbContext _dbContext;
    private readonly ILogger<AnimanaMigrationService> _logger;

    public async Task MigrateClientsAsync(Guid tenantId, IProgress<MigrationProgress> progress)
    {
        var animanaClients = await _animanaConnector.GetClientsAsync();
        var totalClients = animanaClients.Count;
        var processedClients = 0;

        foreach (var animanaClient in animanaClients)
        {
            try
            {
                var client = MapAnimanaClient(animanaClient);
                _dbContext.Clients.Add(client);

                // Map contact methods
                foreach (var contact in animanaClient.ContactMethods)
                {
                    var contactMethod = MapContactMethod(contact, client.Id);
                    _dbContext.ContactMethods.Add(contactMethod);
                }

                await _dbContext.SaveChangesAsync();

                processedClients++;
                progress.Report(new MigrationProgress
                {
                    TotalItems = totalClients,
                    ProcessedItems = processedClients,
                    CurrentItem = $"Client: {client.FirstName} {client.LastName}"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to migrate client {ClientId}", animanaClient.Id);
            }
        }
    }
}
```

### Phased Migration Approach

1. **Dual System Phase**: VetPMS frontend with Animana backend
2. **Parallel Operations**: VetPMS backend deployed alongside Animana with sync
3. **Module Migration**: Gradual migration of modules to VetPMS backend
4. **Complete Transition**: Full cutover to VetPMS backend with historical data

### Backend Transition Strategy

1. **Create custom Refine data provider for .NET backend**

```typescript
// netDataProvider.ts
import { DataProvider } from "@refinedev/core";
import axios from "axios";

export const netDataProvider = (apiUrl: string): DataProvider => ({
  getList: async ({ resource, pagination, filters, sorters }) => {
    const url = `${apiUrl}/${resource}`;
    
    // Build query parameters
    const query = {
      page: pagination?.current || 1,
      pageSize: pagination?.pageSize || 10,
      sort: sorters?.length > 0 ? JSON.stringify(sorters) : undefined,
      filter: filters?.length > 0 ? JSON.stringify(filters) : undefined,
    };
    
    const { data } = await axios.get(url, { params: query });
    
    return {
      data: data.items,
      total: data.total,
    };
  },
  // Implement other methods: getOne, create, update, delete, etc.
});
```

## Implementation Roadmap

### Phase 1: Setup Temporary Backend (Weeks 1-2)

1. **Set up Supabase project**
   - Create project in Supabase
   - Design database schema mirroring our data model
   - Set up authentication with roles
   - Configure row-level security policies

2. **Configure Refine.dev with Supabase**
   - Install Refine.dev and Supabase providers
   - Setup data provider and auth provider
   - Define resources matching our entities

3. **Initial data migration**
   - Create migration script to populate Supabase with test data
   - Validate data integrity and access controls

### Phase 2: Frontend Integration (Weeks 3-5)

1. **Wrap existing app with Refine providers**
   - Set up Refine core with existing React Router
   - Configure resources to match existing routes
   - Keep existing UI components intact

2. **Convert data access layer**
   - Replace custom hooks with Refine hooks (useOne, useList, etc.)
   - Update components to use Refine data patterns
   - Implement optimistic updates and error handling

3. **Enhance auth and access control**
   - Integrate Refine's auth provider with Supabase auth
   - Implement role-based access control
   - Test access control across different user roles

### Phase 3: Workflow Integration (Weeks 6-8)

1. **Set up n8n instance**
   - Deploy n8n (self-hosted or cloud)
   - Configure basic workflows
   - Set up authentication and security

2. **Implement workflow triggers**
   - Create workflow service in frontend
   - Implement webhook endpoints in backend
   - Test end-to-end workflow execution

3. **Create core automation workflows**
   - Appointment reminders
   - Lab result notifications
   - Client follow-ups
   - Inventory alerts

### Phase 4: Backend Development & Transition (Weeks 9-16)

1. **Develop core .NET backend services**
   - Implement Clean Architecture foundation
   - Create API endpoints matching existing data model
   - Build integration service layer

2. **Set up dual-operation mode**
   - Configure frontend to work with both backends
   - Implement data synchronization between systems
   - Test with beta customers

3. **Gradual migration**
   - Migrate data from Supabase to .NET backend
   - Switch modules one by one
   - Validate each migration step

4. **Complete transition**
   - Finalize data migration
   - Switch all systems to .NET backend
   - Decommission temporary backend

### Timeline Overview

```
Week 1-2:   Temporary Backend Setup
Week 3-5:   Frontend Integration
Week 6-8:   Workflow Integration
Week 9-12:  Core Backend Development
Week 13-16: Migration & Transition
```

## Conclusion

This integration strategy provides a pragmatic approach to developing and deploying VetPMS while balancing time-to-market with architectural goals. By leveraging a temporary backend solution initially and using n8n for workflow automation, we can deliver value quickly while building toward a robust, scalable architecture for the long term.

Key benefits include:
- Faster time-to-market with the MVP
- Flexible integration with Animana and other systems
- Powerful workflow automation through n8n
- Secure, multi-tenant design throughout the system
- Clear migration path to the final architecture

This strategy will be regularly reviewed and updated as development progresses and new requirements emerge.
