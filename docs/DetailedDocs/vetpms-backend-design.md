# VetPMS Backend System Design

## Overview

The VetPMS backend is built on ASP.NET Core 8, implementing Clean Architecture principles with CQRS pattern to create a scalable, maintainable, and secure veterinary practice management system.

## Architecture Principles

### Clean Architecture Layers

1. **Domain Layer**: Core business logic and entities
2. **Application Layer**: Use cases, DTOs, and interfaces
3. **Infrastructure Layer**: External concerns (database, APIs, caching)
4. **Presentation Layer**: API controllers and SignalR hubs

### Key Patterns

- **CQRS (Command Query Responsibility Segregation)**: Separate read/write operations
- **Repository Pattern**: Abstract data access logic
- **Unit of Work**: Manage database transactions
- **Mediator Pattern**: Decouple request handling
- **Domain Events**: Loose coupling between aggregates

## Technology Stack

### Core Framework

- **ASP.NET Core 8**: Web API framework
- **C# 12**: Primary programming language
- **.NET 8**: Runtime environment

### Data Access

- **Entity Framework Core 8**: ORM
- **Dapper**: High-performance queries
- **PostgreSQL**: Primary database
- **Redis**: Distributed caching

### Libraries & Tools

- **MediatR**: CQRS implementation
- **AutoMapper**: Object mapping
- **FluentValidation**: Input validation
- **Hangfire**: Background jobs
- **SignalR**: Real-time communication
- **Serilog**: Structured logging
- **Polly**: Resilience and fault handling
- **MassTransit**: Message bus
- **IdentityServer4**: Authentication/Authorization

## Project Structure

```
VetPMS/
├── src/
│   ├── VetPMS.Domain/
│   │   ├── Entities/
│   │   ├── ValueObjects/
│   │   ├── Enums/
│   │   ├── Events/
│   │   └── Exceptions/
│   │
│   ├── VetPMS.Application/
│   │   ├── Common/
│   │   │   ├── Interfaces/
│   │   │   ├── Behaviors/
│   │   │   └── Mappings/
│   │   ├── Features/
│   │   │   ├── Appointments/
│   │   │   ├── Patients/
│   │   │   └── MedicalRecords/
│   │   └── DTOs/
│   │
│   ├── VetPMS.Infrastructure/
│   │   ├── Persistence/
│   │   ├── Identity/
│   │   ├── Services/
│   │   ├── Integrations/
│   │   └── Caching/
│   │
│   └── VetPMS.API/
│       ├── Controllers/
│       ├── Middleware/
│       ├── Filters/
│       └── Hubs/
│
├── tests/
│   ├── VetPMS.Domain.Tests/
│   ├── VetPMS.Application.Tests/
│   ├── VetPMS.Infrastructure.Tests/
│   └── VetPMS.API.Tests/
│
└── docker/
    ├── Dockerfile
    └── docker-compose.yml
```

## Domain Layer

### Core Entities

```csharp
public abstract class BaseEntity
{
    public Guid Id { get; protected set; }
    public DateTime CreatedAt { get; protected set; }
    public DateTime UpdatedAt { get; protected set; }
    public string CreatedBy { get; protected set; }
    public string UpdatedBy { get; protected set; }

    private readonly List<IDomainEvent> _domainEvents = new();
    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    protected void AddDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}

public class Patient : BaseEntity, IAggregateRoot
{
    public string Name { get; private set; }
    public Species Species { get; private set; }
    public string Breed { get; private set; }
    public DateTime DateOfBirth { get; private set; }
    public Gender Gender { get; private set; }
    public Weight Weight { get; private set; }
    public Guid ClientId { get; private set; }
    public PatientStatus Status { get; private set; }

    private readonly List<Allergy> _allergies = new();
    public IReadOnlyCollection<Allergy> Allergies => _allergies.AsReadOnly();

    private readonly List<ChronicCondition> _chronicConditions = new();
    public IReadOnlyCollection<ChronicCondition> ChronicConditions => _chronicConditions.AsReadOnly();

    protected Patient() { } // For EF

    public Patient(
        string name,
        Species species,
        string breed,
        DateTime dateOfBirth,
        Gender gender,
        Weight weight,
        Guid clientId)
    {
        Id = Guid.NewGuid();
        Name = Guard.Against.NullOrWhiteSpace(name, nameof(name));
        Species = Guard.Against.Null(species, nameof(species));
        Breed = breed;
        DateOfBirth = Guard.Against.FutureDate(dateOfBirth, nameof(dateOfBirth));
        Gender = gender;
        Weight = Guard.Against.Null(weight, nameof(weight));
        ClientId = Guard.Against.Empty(clientId, nameof(clientId));
        Status = PatientStatus.Active;
        CreatedAt = DateTime.UtcNow;

        AddDomainEvent(new PatientCreatedEvent(Id, ClientId));
    }

    public void UpdateWeight(Weight newWeight)
    {
        if (Weight != newWeight)
        {
            var oldWeight = Weight;
            Weight = newWeight;
            UpdatedAt = DateTime.UtcNow;

            AddDomainEvent(new PatientWeightChangedEvent(Id, oldWeight, newWeight));
        }
    }

    public void AddAllergy(Allergy allergy)
    {
        if (!_allergies.Contains(allergy))
        {
            _allergies.Add(allergy);
            UpdatedAt = DateTime.UtcNow;

            AddDomainEvent(new PatientAllergyAddedEvent(Id, allergy));
        }
    }
}
```

### Value Objects

```csharp
public class Weight : ValueObject
{
    public decimal Value { get; }
    public WeightUnit Unit { get; }

    public Weight(decimal value, WeightUnit unit)
    {
        if (value <= 0)
            throw new ArgumentException("Weight must be positive", nameof(value));

        Value = value;
        Unit = unit;
    }

    public Weight ConvertTo(WeightUnit targetUnit)
    {
        var valueInKg = Unit switch
        {
            WeightUnit.Kilogram => Value,
            WeightUnit.Gram => Value / 1000,
            WeightUnit.Pound => Value * 0.453592m,
            _ => throw new NotSupportedException($"Unit {Unit} not supported")
        };

        var convertedValue = targetUnit switch
        {
            WeightUnit.Kilogram => valueInKg,
            WeightUnit.Gram => valueInKg * 1000,
            WeightUnit.Pound => valueInKg / 0.453592m,
            _ => throw new NotSupportedException($"Unit {targetUnit} not supported")
        };

        return new Weight(convertedValue, targetUnit);
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
        yield return Unit;
    }
}
```

### Domain Events

```csharp
public interface IDomainEvent
{
    DateTime OccurredOn { get; }
}

public abstract class DomainEvent : IDomainEvent
{
    public DateTime OccurredOn { get; }

    protected DomainEvent()
    {
        OccurredOn = DateTime.UtcNow;
    }
}

public class PatientCreatedEvent : DomainEvent
{
    public Guid PatientId { get; }
    public Guid ClientId { get; }

    public PatientCreatedEvent(Guid patientId, Guid clientId)
    {
        PatientId = patientId;
        ClientId = clientId;
    }
}
```

## Application Layer

### CQRS Implementation

```csharp
// Command
public class CreateAppointmentCommand : IRequest<Result<AppointmentDto>>
{
    public Guid PatientId { get; set; }
    public Guid VeterinarianId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public AppointmentType Type { get; set; }
    public string Notes { get; set; }
}

// Command Handler
public class CreateAppointmentCommandHandler
    : IRequestHandler<CreateAppointmentCommand, Result<AppointmentDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IDateTimeService _dateTimeService;
    private readonly IAppointmentService _appointmentService;

    public CreateAppointmentCommandHandler(
        IApplicationDbContext context,
        IMapper mapper,
        IDateTimeService dateTimeService,
        IAppointmentService appointmentService)
    {
        _context = context;
        _mapper = mapper;
        _dateTimeService = dateTimeService;
        _appointmentService = appointmentService;
    }

    public async Task<Result<AppointmentDto>> Handle(
        CreateAppointmentCommand request,
        CancellationToken cancellationToken)
    {
        // Validate time slot availability
        var isAvailable = await _appointmentService.IsTimeSlotAvailable(
            request.VeterinarianId,
            request.StartTime,
            request.EndTime,
            cancellationToken);

        if (!isAvailable)
        {
            return Result<AppointmentDto>.Failure("Time slot is not available");
        }

        // Create appointment
        var appointment = new Appointment(
            request.PatientId,
            request.VeterinarianId,
            request.StartTime,
            request.EndTime,
            request.Type,
            request.Notes);

        _context.Appointments.Add(appointment);

        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<AppointmentDto>(appointment);
        return Result<AppointmentDto>.Success(dto);
    }
}

// Query
public class GetAppointmentByIdQuery : IRequest<Result<AppointmentDto>>
{
    public Guid AppointmentId { get; set; }
}

// Query Handler
public class GetAppointmentByIdQueryHandler
    : IRequestHandler<GetAppointmentByIdQuery, Result<AppointmentDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAppointmentByIdQueryHandler(
        IApplicationDbContext context,
        IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<AppointmentDto>> Handle(
        GetAppointmentByIdQuery request,
        CancellationToken cancellationToken)
    {
        var appointment = await _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Veterinarian)
            .FirstOrDefaultAsync(a => a.Id == request.AppointmentId, cancellationToken);

        if (appointment == null)
        {
            return Result<AppointmentDto>.Failure("Appointment not found");
        }

        var dto = _mapper.Map<AppointmentDto>(appointment);
        return Result<AppointmentDto>.Success(dto);
    }
}
```

### Validation

```csharp
public class CreateAppointmentCommandValidator : AbstractValidator<CreateAppointmentCommand>
{
    private readonly IApplicationDbContext _context;

    public CreateAppointmentCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(x => x.PatientId)
            .NotEmpty()
            .MustAsync(PatientExists)
            .WithMessage("Patient does not exist");

        RuleFor(x => x.VeterinarianId)
            .NotEmpty()
            .MustAsync(VeterinarianExists)
            .WithMessage("Veterinarian does not exist");

        RuleFor(x => x.StartTime)
            .GreaterThan(DateTime.UtcNow)
            .WithMessage("Start time must be in the future");

        RuleFor(x => x.EndTime)
            .GreaterThan(x => x.StartTime)
            .WithMessage("End time must be after start time");

        RuleFor(x => x.Type)
            .IsInEnum()
            .WithMessage("Invalid appointment type");
    }

    private async Task<bool> PatientExists(Guid patientId, CancellationToken cancellationToken)
    {
        return await _context.Patients.AnyAsync(p => p.Id == patientId, cancellationToken);
    }

    private async Task<bool> VeterinarianExists(Guid veterinarianId, CancellationToken cancellationToken)
    {
        return await _context.Users.AnyAsync(
            u => u.Id == veterinarianId && u.Role == UserRole.Veterinarian,
            cancellationToken);
    }
}
```

### Pipeline Behaviors

```csharp
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (_validators.Any())
        {
            var context = new ValidationContext<TRequest>(request);

            var validationResults = await Task.WhenAll(
                _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

            var failures = validationResults
                .SelectMany(r => r.Errors)
                .Where(f => f != null)
                .ToList();

            if (failures.Count != 0)
            {
                throw new ValidationException(failures);
            }
        }

        return await next();
    }
}

public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;
    private readonly ICurrentUserService _currentUserService;

    public LoggingBehavior(
        ILogger<LoggingBehavior<TRequest, TResponse>> logger,
        ICurrentUserService currentUserService)
    {
        _logger = logger;
        _currentUserService = currentUserService;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var userId = _currentUserService.UserId ?? string.Empty;
        var userName = _currentUserService.UserName ?? string.Empty;

        _logger.LogInformation(
            "VetPMS Request: {Name} {@UserId} {@UserName} {@Request}",
            requestName, userId, userName, request);

        var response = await next();

        _logger.LogInformation(
            "VetPMS Response: {Name} {@UserId} {@UserName}",
            requestName, userId, userName);

        return response;
    }
}
```

## Infrastructure Layer

### Database Context

```csharp
public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTimeService _dateTimeService;
    private readonly IDomainEventService _domainEventService;
    private readonly ITenantService _tenantService;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        ICurrentUserService currentUserService,
        IDateTimeService dateTimeService,
        IDomainEventService domainEventService,
        ITenantService tenantService) : base(options)
    {
        _currentUserService = currentUserService;
        _dateTimeService = dateTimeService;
        _domainEventService = domainEventService;
        _tenantService = tenantService;
    }

    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<MedicalRecord> MedicalRecords => Set<MedicalRecord>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Apply tenant schema
        var tenant = _tenantService.GetCurrentTenant();
        modelBuilder.HasDefaultSchema(tenant.SchemaName);

        // Apply configurations
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // Configure query filters
        modelBuilder.Entity<Patient>().HasQueryFilter(p => p.TenantId == tenant.Id);
        modelBuilder.Entity<Appointment>().HasQueryFilter(a => a.TenantId == tenant.Id);
        modelBuilder.Entity<MedicalRecord>().HasQueryFilter(m => m.TenantId == tenant.Id);

        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Handle audit fields
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = _dateTimeService.Now;
                    entry.Entity.CreatedBy = _currentUserService.UserId;
                    entry.Entity.TenantId = _tenantService.GetCurrentTenant().Id;
                    break;

                case EntityState.Modified:
                    entry.Entity.UpdatedAt = _dateTimeService.Now;
                    entry.Entity.UpdatedBy = _currentUserService.UserId;
                    break;
            }
        }

        // Dispatch domain events
        var events = ChangeTracker.Entries<BaseEntity>()
            .Select(x => x.Entity.DomainEvents)
            .SelectMany(x => x)
            .Where(domainEvent => !domainEvent.IsPublished)
            .ToArray();

        var result = await base.SaveChangesAsync(cancellationToken);

        await DispatchEvents(events);

        return result;
    }

    private async Task DispatchEvents(IDomainEvent[] events)
    {
        foreach (var @event in events)
        {
            @event.IsPublished = true;
            await _domainEventService.Publish(@event);
        }
    }
}
```

### Repository Implementation

```csharp
public class Repository<T> : IRepository<T> where T : BaseEntity, IAggregateRoot
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public IUnitOfWork UnitOfWork => _context;

    public async Task<T> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<T>> GetPagedAsync(
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
        return entity;
    }

    public void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.AnyAsync(e => e.Id == id, cancellationToken);
    }
}

// Specific repository with custom queries
public class PatientRepository : Repository<Patient>, IPatientRepository
{
    public PatientRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<Patient>> GetPatientsByClientAsync(
        Guid clientId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => p.ClientId == clientId)
            .Include(p => p.Allergies)
            .Include(p => p.ChronicConditions)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Patient>> SearchPatientsAsync(
        string searchTerm,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => p.Name.Contains(searchTerm) ||
                        p.Client.LastName.Contains(searchTerm))
            .Include(p => p.Client)
            .ToListAsync(cancellationToken);
    }
}
```

### Caching Layer

```csharp
public interface ICacheService
{
    Task<T> GetOrAddAsync<T>(
        string key,
        Func<Task<T>> factory,
        TimeSpan? expiration = null);
    Task RemoveAsync(string key);
    Task RemoveByPrefixAsync(string prefix);
}

public class RedisCacheService : ICacheService
{
    private readonly IDistributedCache _cache;
    private readonly ILogger<RedisCacheService> _logger;

    public RedisCacheService(
        IDistributedCache cache,
        ILogger<RedisCacheService> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public async Task<T> GetOrAddAsync<T>(
        string key,
        Func<Task<T>> factory,
        TimeSpan? expiration = null)
    {
        var cachedData = await _cache.GetStringAsync(key);

        if (cachedData != null)
        {
            return JsonSerializer.Deserialize<T>(cachedData);
        }

        var data = await factory();

        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(5)
        };

        await _cache.SetStringAsync(
            key,
            JsonSerializer.Serialize(data),
            options);

        return data;
    }

    public async Task RemoveAsync(string key)
    {
        await _cache.RemoveAsync(key);
    }

    public async Task RemoveByPrefixAsync(string prefix)
    {
        // Implementation depends on Redis setup
        // Using StackExchange.Redis for pattern matching
        var server = _connectionMultiplexer.GetServer(_connectionMultiplexer.GetEndPoints().First());
        var keys = server.Keys(pattern: $"{prefix}*").ToArray();

        foreach (var key in keys)
        {
            await _cache.RemoveAsync(key);
        }
    }
}
```

## API Layer

### Controllers

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ApiControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<AppointmentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAppointments(
        [FromQuery] GetAppointmentsQuery query)
    {
        var result = await Mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(AppointmentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAppointment(Guid id)
    {
        var query = new GetAppointmentByIdQuery { AppointmentId = id };
        var result = await Mediator.Send(query);

        if (!result.IsSuccess)
        {
            return NotFound(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPost]
    [ProducesResponseType(typeof(AppointmentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAppointment(
        [FromBody] CreateAppointmentCommand command)
    {
        var result = await Mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return CreatedAtAction(
            nameof(GetAppointment),
            new { id = result.Value.Id },
            result.Value);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateAppointment(
        Guid id,
        [FromBody] UpdateAppointmentCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest("ID mismatch");
        }

        var result = await Mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return NoContent();
    }

    [HttpPost("{id}/check-in")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CheckInAppointment(Guid id)
    {
        var command = new CheckInAppointmentCommand { AppointmentId = id };
        var result = await Mediator.Send(command);

        if (!result.IsSuccess)
        {
            return NotFound(result.Error);
        }

        return NoContent();
    }
}

public abstract class ApiControllerBase : ControllerBase
{
    private ISender _mediator = null!;
    protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();
}
```

### Real-time Communication

```csharp
[Authorize]
public class AppointmentHub : Hub
{
    private readonly ITenantService _tenantService;
    private readonly ILogger<AppointmentHub> _logger;

    public AppointmentHub(
        ITenantService tenantService,
        ILogger<AppointmentHub> logger)
    {
        _tenantService = tenantService;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var tenant = _tenantService.GetCurrentTenant();
        await Groups.AddToGroupAsync(Context.ConnectionId, $"tenant_{tenant.Id}");

        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        }

        await base.OnConnectedAsync();
    }

    public async Task JoinAppointmentRoom(Guid appointmentId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"appointment_{appointmentId}");
    }

    public async Task LeaveAppointmentRoom(Guid appointmentId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"appointment_{appointmentId}");
    }
}

// Notification service using SignalR
public class NotificationService : INotificationService
{
    private readonly IHubContext<AppointmentHub> _hubContext;

    public NotificationService(IHubContext<AppointmentHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendAppointmentUpdateAsync(
        Guid appointmentId,
        AppointmentUpdateDto update)
    {
        await _hubContext.Clients
            .Group($"appointment_{appointmentId}")
            .SendAsync("AppointmentUpdated", update);
    }

    public async Task SendUserNotificationAsync(
        Guid userId,
        NotificationDto notification)
    {
        await _hubContext.Clients
            .Group($"user_{userId}")
            .SendAsync("NotificationReceived", notification);
    }
}
```

### Middleware

```csharp
public class TenantMiddleware
{
    private readonly RequestDelegate _next;

    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext context,
        ITenantService tenantService)
    {
        // Extract tenant from route, header, or claim
        var tenantId = ExtractTenantId(context);

        if (tenantId.HasValue)
        {
            tenantService.SetCurrentTenant(tenantId.Value);
        }

        await _next(context);
    }

    private Guid? ExtractTenantId(HttpContext context)
    {
        // Try route data
        if (context.GetRouteValue("tenantId") is string routeTenantId &&
            Guid.TryParse(routeTenantId, out var tenantId))
        {
            return tenantId;
        }

        // Try header
        if (context.Request.Headers.TryGetValue("X-Tenant-ID", out var headerTenantId) &&
            Guid.TryParse(headerTenantId, out tenantId))
        {
            return tenantId;
        }

        // Try claim
        var claim = context.User?.FindFirst("tenant_id");
        if (claim != null && Guid.TryParse(claim.Value, out tenantId))
        {
            return tenantId;
        }

        return null;
    }
}

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = context.Response;
        var errorResponse = new ErrorResponse();

        switch (exception)
        {
            case ValidationException validationException:
                response.StatusCode = StatusCodes.Status400BadRequest;
                errorResponse.Message = "Validation failed";
                errorResponse.Errors = validationException.Errors
                    .Select(e => new ErrorDetail
                    {
                        Field = e.PropertyName,
                        Message = e.ErrorMessage
                    })
                    .ToList();
                break;

            case NotFoundException notFoundException:
                response.StatusCode = StatusCodes.Status404NotFound;
                errorResponse.Message = notFoundException.Message;
                break;

            case UnauthorizedAccessException:
                response.StatusCode = StatusCodes.Status401Unauthorized;
                errorResponse.Message = "Unauthorized access";
                break;

            case ForbiddenException:
                response.StatusCode = StatusCodes.Status403Forbidden;
                errorResponse.Message = "Access forbidden";
                break;

            default:
                response.StatusCode = StatusCodes.Status500InternalServerError;
                errorResponse.Message = "An internal error occurred";
                errorResponse.Details = exception.Message;
                break;
        }

        var result = JsonSerializer.Serialize(errorResponse);
        await response.WriteAsync(result);
    }
}
```

## Background Jobs

### Hangfire Configuration

```csharp
public static class HangfireConfiguration
{
    public static IServiceCollection AddHangfireServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddHangfire(config =>
        {
            config
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UsePostgreSqlStorage(configuration.GetConnectionString("HangfireConnection"));
        });

        services.AddHangfireServer(options =>
        {
            options.WorkerCount = Environment.ProcessorCount * 2;
            options.Queues = new[] { "critical", "default", "low" };
        });

        return services;
    }
}

// Background job service
public class AppointmentReminderService : IAppointmentReminderService
{
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly ILogger<AppointmentReminderService> _logger;

    public AppointmentReminderService(
        IBackgroundJobClient backgroundJobClient,
        ILogger<AppointmentReminderService> logger)
    {
        _backgroundJobClient = backgroundJobClient;
        _logger = logger;
    }

    public void ScheduleReminder(Guid appointmentId, DateTime reminderTime)
    {
        var jobId = _backgroundJobClient.Schedule<IReminderJob>(
            job => job.SendAppointmentReminder(appointmentId),
            reminderTime);

        _logger.LogInformation(
            "Scheduled reminder for appointment {AppointmentId} at {ReminderTime}. JobId: {JobId}",
            appointmentId, reminderTime, jobId);
    }
}

public class ReminderJob : IReminderJob
{
    private readonly IMediator _mediator;

    public ReminderJob(IMediator mediator)
    {
        _mediator = mediator;
    }

    [Queue("default")]
    public async Task SendAppointmentReminder(Guid appointmentId)
    {
        var command = new SendAppointmentReminderCommand { AppointmentId = appointmentId };
        await _mediator.Send(command);
    }
}
```

## Security

### Authentication Configuration

```csharp
public static class AuthenticationConfiguration
{
    public static IServiceCollection AddAuthenticationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Authority = configuration["Authentication:Authority"];
                options.Audience = configuration["Authentication:Audience"];
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;

                        if (!string.IsNullOrEmpty(accessToken) &&
                            path.StartsWithSegments("/hubs"))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization(options =>
        {
            options.AddPolicy("RequireVeterinarianRole", policy =>
                policy.RequireRole("Veterinarian"));

            options.AddPolicy("RequireAdminRole", policy =>
                policy.RequireRole("Admin"));

            options.AddPolicy("RequireTenantAccess", policy =>
                policy.Requirements.Add(new TenantAccessRequirement()));
        });

        return services;
    }
}
```

### Authorization Handlers

```csharp
public class TenantAccessRequirement : IAuthorizationRequirement { }

public class TenantAccessHandler : AuthorizationHandler<TenantAccessRequirement>
{
    private readonly ITenantService _tenantService;

    public TenantAccessHandler(ITenantService tenantService)
    {
        _tenantService = tenantService;
    }

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        TenantAccessRequirement requirement)
    {
        var tenantClaim = context.User.FindFirst("tenant_id");
        if (tenantClaim == null)
        {
            return Task.CompletedTask;
        }

        var currentTenant = _tenantService.GetCurrentTenant();
        if (currentTenant != null && tenantClaim.Value == currentTenant.Id.ToString())
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
```

## Monitoring & Logging

### Serilog Configuration

```csharp
public static class LoggingConfiguration
{
    public static IHostBuilder ConfigureLogging(this IHostBuilder hostBuilder)
    {
        return hostBuilder.UseSerilog((context, services, configuration) =>
        {
            configuration
                .ReadFrom.Configuration(context.Configuration)
                .ReadFrom.Services(services)
                .Enrich.FromLogContext()
                .Enrich.WithMachineName()
                .Enrich.WithEnvironmentName()
                .Enrich.WithProperty("Application", "VetPMS")
                .WriteTo.Console()
                .WriteTo.File(
                    path: "logs/log-.txt",
                    rollingInterval: RollingInterval.Day,
                    retainedFileCountLimit: 30)
                .WriteTo.Seq(context.Configuration["Seq:ServerUrl"])
                .WriteTo.ApplicationInsights(
                    services.GetRequiredService<TelemetryConfiguration>(),
                    TelemetryConverter.Traces);
        });
    }
}
```

### Health Checks

```csharp
public static class HealthCheckConfiguration
{
    public static IServiceCollection AddHealthCheckServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddHealthChecks()
            .AddDbContextCheck<ApplicationDbContext>("Database")
            .AddRedis(configuration.GetConnectionString("Redis"), "Redis")
            .AddUrlGroup(new Uri(configuration["ExternalServices:AnimanaApi"]), "Animana API")
            .AddCheck<TenantHealthCheck>("Tenant Service");

        services.AddHealthChecksUI()
            .AddInMemoryStorage();

        return services;
    }
}

public class TenantHealthCheck : IHealthCheck
{
    private readonly ITenantService _tenantService;

    public TenantHealthCheck(ITenantService tenantService)
    {
        _tenantService = tenantService;
    }

    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var tenant = _tenantService.GetCurrentTenant();
            if (tenant != null)
            {
                return Task.FromResult(HealthCheckResult.Healthy("Tenant service is healthy"));
            }

            return Task.FromResult(HealthCheckResult.Degraded("No current tenant"));
        }
        catch (Exception ex)
        {
            return Task.FromResult(HealthCheckResult.Unhealthy("Tenant service is unhealthy", ex));
        }
    }
}
```

## Testing

### Unit Testing

```csharp
public class CreateAppointmentCommandHandlerTests
{
    private readonly Mock<IApplicationDbContext> _contextMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IAppointmentService> _appointmentServiceMock;
    private readonly CreateAppointmentCommandHandler _handler;

    public CreateAppointmentCommandHandlerTests()
    {
        _contextMock = new Mock<IApplicationDbContext>();
        _mapperMock = new Mock<IMapper>();
        _appointmentServiceMock = new Mock<IAppointmentService>();

        _handler = new CreateAppointmentCommandHandler(
            _contextMock.Object,
            _mapperMock.Object,
            Mock.Of<IDateTimeService>(),
            _appointmentServiceMock.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_CreatesAppointment()
    {
        // Arrange
        var command = new CreateAppointmentCommand
        {
            PatientId = Guid.NewGuid(),
            VeterinarianId = Guid.NewGuid(),
            StartTime = DateTime.UtcNow.AddDays(1),
            EndTime = DateTime.UtcNow.AddDays(1).AddHours(1),
            Type = AppointmentType.Consultation
        };

        _appointmentServiceMock
            .Setup(x => x.IsTimeSlotAvailable(
                command.VeterinarianId,
                command.StartTime,
                command.EndTime,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var mockSet = new Mock<DbSet<Appointment>>();
        _contextMock.Setup(x => x.Appointments).Returns(mockSet.Object);
        _contextMock.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        _mapperMock.Setup(x => x.Map<AppointmentDto>(It.IsAny<Appointment>()))
            .Returns(new AppointmentDto());

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        mockSet.Verify(x => x.Add(It.IsAny<Appointment>()), Times.Once);
        _contextMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_TimeSlotNotAvailable_ReturnsFailure()
    {
        // Arrange
        var command = new CreateAppointmentCommand();

        _appointmentServiceMock
            .Setup(x => x.IsTimeSlotAvailable(
                It.IsAny<Guid>(),
                It.IsAny<DateTime>(),
                It.IsAny<DateTime>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Time slot is not available", result.Error);
    }
}
```

### Integration Testing

```csharp
public class AppointmentsControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public AppointmentsControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateAppointment_ValidRequest_ReturnsCreated()
    {
        // Arrange
        var command = new CreateAppointmentCommand
        {
            PatientId = Guid.NewGuid(),
            VeterinarianId = Guid.NewGuid(),
            StartTime = DateTime.UtcNow.AddDays(1),
            EndTime = DateTime.UtcNow.AddDays(1).AddHours(1),
            Type = AppointmentType.Consultation
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/appointments", command);

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var appointment = await response.Content.ReadFromJsonAsync<AppointmentDto>();
        Assert.NotNull(appointment);
        Assert.NotEqual(Guid.Empty, appointment.Id);
    }
}
```

## Performance Optimization

### Database Optimization

```csharp
// Compiled queries for frequently used operations
public static class CompiledQueries
{
    public static readonly Func<ApplicationDbContext, Guid, Task<Patient>> GetPatientById =
        EF.CompileAsyncQuery((ApplicationDbContext context, Guid id) =>
            context.Patients
                .Include(p => p.Allergies)
                .Include(p => p.ChronicConditions)
                .FirstOrDefault(p => p.Id == id));

    public static readonly Func<ApplicationDbContext, DateTime, DateTime, IAsyncEnumerable<Appointment>> GetAppointmentsByDateRange =
        EF.CompileAsyncQuery((ApplicationDbContext context, DateTime startDate, DateTime endDate) =>
            context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Veterinarian)
                .Where(a => a.StartTime >= startDate && a.StartTime <= endDate)
                .OrderBy(a => a.StartTime));
}
```

### Response Compression

```csharp
public static class CompressionConfiguration
{
    public static IServiceCollection AddResponseCompressionServices(
        this IServiceCollection services)
    {
        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<BrotliCompressionProvider>();
            options.Providers.Add<GzipCompressionProvider>();
        });

        services.Configure<BrotliCompressionProviderOptions>(options =>
        {
            options.Level = CompressionLevel.Fastest;
        });

        services.Configure<GzipCompressionProviderOptions>(options =>
        {
            options.Level = CompressionLevel.Optimal;
        });

        return services;
    }
}
```

## Deployment

### Docker Configuration

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["src/VetPMS.API/VetPMS.API.csproj", "VetPMS.API/"]
COPY ["src/VetPMS.Application/VetPMS.Application.csproj", "VetPMS.Application/"]
COPY ["src/VetPMS.Domain/VetPMS.Domain.csproj", "VetPMS.Domain/"]
COPY ["src/VetPMS.Infrastructure/VetPMS.Infrastructure.csproj", "VetPMS.Infrastructure/"]
RUN dotnet restore "VetPMS.API/VetPMS.API.csproj"

# Copy everything else and build
COPY src/ .
WORKDIR "/src/VetPMS.API"
RUN dotnet build "VetPMS.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "VetPMS.API.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Install culture data
RUN apt-get update && apt-get install -y locales

# Copy published output
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl --fail http://localhost/health || exit 1

ENTRYPOINT ["dotnet", "VetPMS.API.dll"]
```

### Docker Compose

```yaml
version: "3.8"

services:
  api:
    build:
      context: .
      dockerfile: src/VetPMS.API/Dockerfile
    ports:
      - "5000:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Host=db;Database=VetPMS;Username=postgres;Password=postgres
      - ConnectionStrings__Redis=redis:6379
    depends_on:
      - db
      - redis
    networks:
      - VetPMS-network

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=VetPMS
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - VetPMS-network

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - VetPMS-network

  seq:
    image: datalust/seq:latest
    environment:
      - ACCEPT_EULA=Y
    ports:
      - "5341:80"
    volumes:
      - seq_data:/data
    networks:
      - VetPMS-network

volumes:
  postgres_data:
  redis_data:
  seq_data:

networks:
  VetPMS-network:
    driver: bridge
```

## Conclusion

The VetPMS backend architecture provides a robust, scalable foundation for veterinary practice management. Key strengths include:

1. **Clean Architecture**: Clear separation of concerns for maintainability
2. **CQRS Pattern**: Optimized read/write operations
3. **Multi-tenancy**: Secure data isolation for franchise operations
4. **Real-time Communication**: SignalR for live updates
5. **Comprehensive Testing**: Unit and integration test coverage
6. **Performance Optimization**: Caching, compiled queries, and response compression
7. **Monitoring & Logging**: Structured logging with health checks
8. **Security**: JWT authentication with role-based authorization

This architecture supports the complex requirements of modern veterinary practices while maintaining flexibility for future enhancements and integrations.
