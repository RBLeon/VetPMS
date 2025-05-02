# VetPMS Data System Design

## Overview

The VetPMS data architecture implements a multi-tenant, scalable database design that supports the complex requirements of veterinary practice management while ensuring data isolation, performance, and compliance with healthcare regulations.

## Database Architecture

### Multi-Tenant Strategy

We implement a **Schema-per-Tenant** approach with PostgreSQL, providing:

- Strong data isolation between practices
- Simplified backup and restore per tenant
- Performance optimization per tenant
- Compliance with data residency requirements

```sql
-- Shared schema for system-wide data
CREATE SCHEMA system;

-- Tenant management table
CREATE TABLE system.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    schema_name VARCHAR(63) NOT NULL UNIQUE,
    tenant_type VARCHAR(50) NOT NULL,
    parent_id UUID REFERENCES system.tenants(id),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT valid_schema_name CHECK (schema_name ~ '^[a-z][a-z0-9_]*$')
);

-- Tenant provisioning function
CREATE OR REPLACE FUNCTION system.provision_tenant(
    p_tenant_name TEXT,
    p_tenant_type TEXT,
    p_parent_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_tenant_id UUID;
    v_schema_name TEXT;
BEGIN
    -- Generate schema name
    v_schema_name := 'tenant_' || replace(gen_random_uuid()::text, '-', '_');

    -- Create tenant record
    INSERT INTO system.tenants (name, schema_name, tenant_type, parent_id)
    VALUES (p_tenant_name, v_schema_name, p_tenant_type, p_parent_id)
    RETURNING id INTO v_tenant_id;

    -- Create tenant schema
    EXECUTE format('CREATE SCHEMA %I', v_schema_name);

    -- Create tenant tables
    PERFORM system.create_tenant_tables(v_schema_name);

    RETURN v_tenant_id;
END;
$$ LANGUAGE plpgsql;
```

### Core Database Schema

#### Patient Management

```sql
-- Create tables for a tenant schema
CREATE OR REPLACE FUNCTION system.create_tenant_tables(p_schema_name TEXT)
RETURNS void AS $$
BEGIN
    -- Clients table
    EXECUTE format('
        CREATE TABLE %I.clients (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255),
            client_type VARCHAR(50) DEFAULT ''REGULAR'',
            tags TEXT[] DEFAULT ''{}'',
            metadata JSONB DEFAULT ''{}'',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            created_by UUID NOT NULL,
            updated_by UUID,
            is_deleted BOOLEAN DEFAULT false
        )', p_schema_name);

    -- Contact methods
    EXECUTE format('
        CREATE TABLE %I.contact_methods (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            client_id UUID NOT NULL REFERENCES %I.clients(id),
            type VARCHAR(50) NOT NULL,
            value VARCHAR(255) NOT NULL,
            is_primary BOOLEAN DEFAULT false,
            is_verified BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )', p_schema_name, p_schema_name);

    -- Patients table
    EXECUTE format('
        CREATE TABLE %I.patients (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            client_id UUID NOT NULL REFERENCES %I.clients(id),
            name VARCHAR(100) NOT NULL,
            species VARCHAR(50) NOT NULL,
            breed VARCHAR(100),
            color VARCHAR(50),
            date_of_birth DATE,
            gender VARCHAR(20),
            is_neutered BOOLEAN DEFAULT false,
            microchip_id VARCHAR(50),
            weight_kg DECIMAL(8,2),
            status VARCHAR(50) DEFAULT ''ACTIVE'',
            deceased_date DATE,
            medical_alerts TEXT[] DEFAULT ''{}'',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            created_by UUID NOT NULL,
            updated_by UUID
        )', p_schema_name, p_schema_name);

    -- Patient allergies
    EXECUTE format('
        CREATE TABLE %I.patient_allergies (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            patient_id UUID NOT NULL REFERENCES %I.patients(id),
            allergen VARCHAR(255) NOT NULL,
            reaction VARCHAR(255),
            severity VARCHAR(50),
            confirmed_date DATE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )', p_schema_name, p_schema_name);

    -- Create indexes
    EXECUTE format('
        CREATE INDEX idx_%I_clients_email ON %I.clients(email) WHERE email IS NOT NULL;
        CREATE INDEX idx_%I_clients_lastname ON %I.clients(last_name);
        CREATE INDEX idx_%I_patients_client ON %I.patients(client_id);
        CREATE INDEX idx_%I_patients_microchip ON %I.patients(microchip_id) WHERE microchip_id IS NOT NULL;
    ', p_schema_name, p_schema_name, p_schema_name, p_schema_name,
       p_schema_name, p_schema_name, p_schema_name, p_schema_name);
END;
$$ LANGUAGE plpgsql;
```

#### Appointment Management

```sql
-- Appointments and scheduling
CREATE TABLE tenant_schema.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    appointment_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    canceled_at TIMESTAMPTZ,
    canceled_by UUID,
    cancellation_reason TEXT,
    CONSTRAINT valid_appointment_times CHECK (scheduled_end > scheduled_start)
);

-- Appointment staff assignments
CREATE TABLE tenant_schema.appointment_staff (
    appointment_id UUID REFERENCES appointments(id),
    staff_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    PRIMARY KEY (appointment_id, staff_id)
);

-- Appointment resources
CREATE TABLE tenant_schema.appointment_resources (
    appointment_id UUID REFERENCES appointments(id),
    resource_id UUID NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    PRIMARY KEY (appointment_id, resource_id)
);

-- Create scheduling indexes
CREATE INDEX idx_appointments_scheduled_start ON appointments(scheduled_start);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_status ON appointments(status) WHERE status != 'COMPLETED';
```

#### Medical Records

```sql
-- Medical records structure
CREATE TABLE tenant_schema.medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    appointment_id UUID REFERENCES appointments(id),
    visit_date TIMESTAMPTZ NOT NULL,
    record_type VARCHAR(50) NOT NULL,
    chief_complaint TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_by UUID,
    signed_at TIMESTAMPTZ,
    signed_by UUID,
    is_locked BOOLEAN DEFAULT false
);

-- SOAP notes
CREATE TABLE tenant_schema.soap_notes (
    medical_record_id UUID PRIMARY KEY REFERENCES medical_records(id),
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    additional_notes TEXT
);

-- Vital signs
CREATE TABLE tenant_schema.vital_signs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medical_record_id UUID NOT NULL REFERENCES medical_records(id),
    temperature_celsius DECIMAL(4,1),
    pulse_rate INTEGER,
    respiratory_rate INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    weight_kg DECIMAL(8,2),
    body_condition_score INTEGER,
    pain_score INTEGER,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    recorded_by UUID NOT NULL
);

-- Diagnoses
CREATE TABLE tenant_schema.diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medical_record_id UUID NOT NULL REFERENCES medical_records(id),
    diagnosis_code VARCHAR(50),
    diagnosis_name VARCHAR(255) NOT NULL,
    diagnosis_type VARCHAR(50),
    notes TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Treatments
CREATE TABLE tenant_schema.treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medical_record_id UUID NOT NULL REFERENCES medical_records(id),
    treatment_type VARCHAR(50) NOT NULL,
    treatment_name VARCHAR(255) NOT NULL,
    description TEXT,
    performed_at TIMESTAMPTZ,
    performed_by UUID,
    status VARCHAR(50) DEFAULT 'PLANNED',
    notes TEXT
);

-- Prescriptions
CREATE TABLE tenant_schema.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medical_record_id UUID NOT NULL REFERENCES medical_records(id),
    medication_name VARCHAR(255) NOT NULL,
    medication_code VARCHAR(50),
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    route VARCHAR(50) NOT NULL,
    duration VARCHAR(100),
    quantity DECIMAL(10,2),
    refills INTEGER DEFAULT 0,
    instructions TEXT,
    prescribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    prescribed_by UUID NOT NULL,
    dispensed_at TIMESTAMPTZ,
    dispensed_by UUID
);
```

#### Inventory Management

```sql
-- Inventory items
CREATE TABLE tenant_schema.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    unit_of_measure VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(255),
    supplier VARCHAR(255),
    description TEXT,
    is_medication BOOLEAN DEFAULT false,
    is_controlled BOOLEAN DEFAULT false,
    requires_prescription BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Inventory stock
CREATE TABLE tenant_schema.inventory_stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES inventory_items(id),
    location_id UUID NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    reorder_point DECIMAL(10,2),
    reorder_quantity DECIMAL(10,2),
    last_counted_at TIMESTAMPTZ,
    last_counted_by UUID
);

-- Inventory batches
CREATE TABLE tenant_schema.inventory_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES inventory_items(id),
    batch_number VARCHAR(100) NOT NULL,
    lot_number VARCHAR(100),
    expiration_date DATE,
    quantity_received DECIMAL(10,2) NOT NULL,
    quantity_remaining DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2),
    received_date DATE NOT NULL,
    supplier_invoice VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inventory transactions
CREATE TABLE tenant_schema.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES inventory_items(id),
    batch_id UUID REFERENCES inventory_batches(id),
    transaction_type VARCHAR(50) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2),
    reference_type VARCHAR(50),
    reference_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL
);
```

#### Billing and Financial

```sql
-- Invoices
CREATE TABLE tenant_schema.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    client_id UUID NOT NULL REFERENCES clients(id),
    appointment_id UUID REFERENCES appointments(id),
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL
);

-- Invoice line items
CREATE TABLE tenant_schema.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    item_type VARCHAR(50) NOT NULL,
    item_id UUID,
    description VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    discount_rate DECIMAL(5,2) DEFAULT 0,
    line_total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payments
CREATE TABLE tenant_schema.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    payment_date TIMESTAMPTZ NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    reference_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL
);
```

### Audit and History

```sql
-- Audit log
CREATE TABLE tenant_schema.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_fields TEXT[],
    user_id UUID NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION tenant_schema.audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO tenant_schema.audit_log(
            table_name, record_id, action, old_data, user_id
        ) VALUES (
            TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD),
            current_setting('app.current_user_id')::UUID
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO tenant_schema.audit_log(
            table_name, record_id, action, old_data, new_data,
            changed_fields, user_id
        ) VALUES (
            TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD),
            row_to_json(NEW), akeys(hstore(NEW) - hstore(OLD)),
            current_setting('app.current_user_id')::UUID
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO tenant_schema.audit_log(
            table_name, record_id, action, new_data, user_id
        ) VALUES (
            TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW),
            current_setting('app.current_user_id')::UUID
        );
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to key tables
CREATE TRIGGER audit_patients
    AFTER INSERT OR UPDATE OR DELETE ON tenant_schema.patients
    FOR EACH ROW EXECUTE FUNCTION tenant_schema.audit_trigger();

CREATE TRIGGER audit_medical_records
    AFTER INSERT OR UPDATE OR DELETE ON tenant_schema.medical_records
    FOR EACH ROW EXECUTE FUNCTION tenant_schema.audit_trigger();
```

## Data Access Patterns

### Entity Framework Core Configuration

```csharp
public class TenantDbContext : DbContext
{
    private readonly ITenantService _tenantService;

    public TenantDbContext(
        DbContextOptions<TenantDbContext> options,
        ITenantService tenantService) : base(options)
    {
        _tenantService = tenantService;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var tenant = _tenantService.GetCurrentTenant();
        modelBuilder.HasDefaultSchema(tenant.SchemaName);

        // Configure entities
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TenantDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Set current user for audit logging
        var userId = _currentUserService.UserId;
        if (!string.IsNullOrEmpty(userId))
        {
            await Database.ExecuteSqlRawAsync(
                $"SET LOCAL app.current_user_id = '{userId}'",
                cancellationToken);
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}

// Entity configuration example
public class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.ToTable("patients");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Species)
            .IsRequired()
            .HasMaxLength(50)
            .HasConversion<string>();

        builder.HasOne(p => p.Client)
            .WithMany(c => c.Patients)
            .HasForeignKey(p => p.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(p => p.MicrochipId)
            .IsUnique()
            .HasFilter("microchip_id IS NOT NULL");
    }
}
```

### Query Optimization

```sql
-- Materialized view for appointment dashboard
CREATE MATERIALIZED VIEW tenant_schema.appointment_dashboard AS
SELECT
    a.id,
    a.scheduled_start,
    a.scheduled_end,
    a.appointment_type,
    a.status,
    p.id as patient_id,
    p.name as patient_name,
    p.species,
    c.id as client_id,
    c.first_name || ' ' || c.last_name as client_name,
    array_agg(DISTINCT s.staff_id) FILTER (WHERE s.staff_id IS NOT NULL) as staff_ids,
    array_agg(DISTINCT r.resource_id) FILTER (WHERE r.resource_id IS NOT NULL) as resource_ids
FROM tenant_schema.appointments a
JOIN tenant_schema.patients p ON a.patient_id = p.id
JOIN tenant_schema.clients c ON p.client_id = c.id
LEFT JOIN tenant_schema.appointment_staff s ON a.id = s.appointment_id
LEFT JOIN tenant_schema.appointment_resources r ON a.id = r.appointment_id
WHERE a.status != 'CANCELED'
GROUP BY a.id, p.id, p.name, p.species, c.id, c.first_name, c.last_name;

-- Refresh materialized view
CREATE OR REPLACE FUNCTION tenant_schema.refresh_appointment_dashboard()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY tenant_schema.appointment_dashboard;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create refresh triggers
CREATE TRIGGER refresh_dashboard_appointments
    AFTER INSERT OR UPDATE OR DELETE ON tenant_schema.appointments
    FOR EACH STATEMENT EXECUTE FUNCTION tenant_schema.refresh_appointment_dashboard();
```

### Partitioning Strategy

```sql
-- Partition large tables by date
CREATE TABLE tenant_schema.medical_records (
    -- columns as defined above
) PARTITION BY RANGE (visit_date);

-- Create monthly partitions
CREATE TABLE tenant_schema.medical_records_2025_01
    PARTITION OF tenant_schema.medical_records
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE tenant_schema.medical_records_2025_02
    PARTITION OF tenant_schema.medical_records
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Automatic partition creation
CREATE OR REPLACE FUNCTION tenant_schema.create_medical_records_partition()
RETURNS TRIGGER AS $$
DECLARE
    partition_date DATE;
    partition_name TEXT;
    start_date DATE;
    end_date DATE;
BEGIN
    partition_date := DATE_TRUNC('month', NEW.visit_date);
    partition_name := format('medical_records_%s', TO_CHAR(partition_date, 'YYYY_MM'));
    start_date := partition_date;
    end_date := partition_date + INTERVAL '1 month';

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = TG_TABLE_SCHEMA
        AND tablename = partition_name
    ) THEN
        EXECUTE format(
            'CREATE TABLE %I.%I PARTITION OF %I.medical_records
            FOR VALUES FROM (%L) TO (%L)',
            TG_TABLE_SCHEMA, partition_name, TG_TABLE_SCHEMA,
            start_date, end_date
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Data Migration

### Migration from Animana

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

    private Client MapAnimanaClient(AnimanaClient animanaClient)
    {
        return new Client
        {
            FirstName = animanaClient.FirstName,
            LastName = animanaClient.LastName,
            Email = animanaClient.Email,
            ClientType = MapClientType(animanaClient.Type),
            Metadata = new Dictionary<string, object>
            {
                ["animana_id"] = animanaClient.Id,
                ["migrated_at"] = DateTime.UtcNow
            }
        };
    }
}
```

### Data Synchronization

```csharp
public class DataSynchronizationService
{
    private readonly IAnimanaConnector _animanaConnector;
    private readonly TenantDbContext _dbContext;
    private readonly IDistributedCache _cache;

    public async Task SynchronizeAppointmentsAsync(DateTime startDate, DateTime endDate)
    {
        var cacheKey = $"sync_appointments_{startDate:yyyyMMdd}_{endDate:yyyyMMdd}";

        // Check if sync is already in progress
        if (!await _cache.SetAsync(cacheKey, "processing", TimeSpan.FromMinutes(30), When.NotExists))
        {
            return; // Sync already in progress
        }

        try
        {
            // Get appointments from Animana
            var animanaAppointments = await _animanaConnector.GetAppointmentsAsync(startDate, endDate);

            // Get existing appointments
            var existingAppointments = await _dbContext.Appointments
                .Where(a => a.ScheduledStart >= startDate && a.ScheduledStart <= endDate)
                .ToDictionaryAsync(a => a.Metadata["animana_id"].ToString());

            foreach (var animanaAppointment in animanaAppointments)
            {
                if (existingAppointments.TryGetValue(animanaAppointment.Id, out var existingAppointment))
                {
                    // Update existing appointment
                    UpdateAppointment(existingAppointment, animanaAppointment);
                }
                else
                {
                    // Create new appointment
                    var newAppointment = MapAnimanaAppointment(animanaAppointment);
                    _dbContext.Appointments.Add(newAppointment);
                }
            }

            await _dbContext.SaveChangesAsync();
        }
        finally
        {
            await _cache.RemoveAsync(cacheKey);
        }
    }
}
```

## Search and Analytics

### Elasticsearch Integration

```csharp
public class SearchIndexService
{
    private readonly IElasticClient _elasticClient;
    private readonly TenantDbContext _dbContext;

    public async Task IndexPatientsAsync()
    {
        var patients = await _dbContext.Patients
            .Include(p => p.Client)
            .Include(p => p.Allergies)
            .ToListAsync();

        var bulkResponse = await _elasticClient.IndexManyAsync(patients.Select(p => new
        {
            Id = p.Id,
            Name = p.Name,
            Species = p.Species,
            Breed = p.Breed,
            ClientName = $"{p.Client.FirstName} {p.Client.LastName}",
            ClientEmail = p.Client.Email,
            MicrochipId = p.MicrochipId,
            Allergies = p.Allergies.Select(a => a.Allergen),
            MedicalAlerts = p.MedicalAlerts,
            IndexedAt = DateTime.UtcNow
        }));

        if (!bulkResponse.IsValid)
        {
            throw new Exception($"Failed to index patients: {bulkResponse.DebugInformation}");
        }
    }

    public async Task<SearchResult<PatientSearchResult>> SearchPatientsAsync(string query)
    {
        var searchResponse = await _elasticClient.SearchAsync<PatientSearchResult>(s => s
            .Query(q => q
                .MultiMatch(m => m
                    .Query(query)
                    .Fields(f => f
                        .Field(p => p.Name, boost: 2.0)
                        .Field(p => p.ClientName, boost: 1.5)
                        .Field(p => p.MicrochipId, boost: 1.5)
                        .Field(p => p.Breed)
                        .Field(p => p.Species)
                    )
                    .Type(TextQueryType.BestFields)
                    .Fuzziness(Fuzziness.Auto)
                )
            )
            .Size(50)
        );

        return new SearchResult<PatientSearchResult>
        {
            Items = searchResponse.Documents.ToList(),
            TotalCount = searchResponse.Total,
            Took = searchResponse.Took
        };
    }
}
```

### Analytics Queries

```sql
-- Daily appointment statistics
CREATE OR REPLACE FUNCTION tenant_schema.get_daily_appointment_stats(
    p_start_date DATE,
    p_end_date DATE
) RETURNS TABLE (
    appointment_date DATE,
    total_appointments INTEGER,
    completed_appointments INTEGER,
    canceled_appointments INTEGER,
    no_show_appointments INTEGER,
    average_duration INTERVAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        DATE(scheduled_start) as appointment_date,
        COUNT(*) as total_appointments,
        COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_appointments,
        COUNT(*) FILTER (WHERE status = 'CANCELED') as canceled_appointments,
        COUNT(*) FILTER (WHERE status = 'NO_SHOW') as no_show_appointments,
        AVG(actual_end - actual_start) FILTER (WHERE status = 'COMPLETED') as average_duration
    FROM tenant_schema.appointments
    WHERE DATE(scheduled_start) BETWEEN p_start_date AND p_end_date
    GROUP BY DATE(scheduled_start)
    ORDER BY appointment_date;
END;
$$ LANGUAGE plpgsql;

-- Revenue analysis
CREATE OR REPLACE FUNCTION tenant_schema.get_revenue_analysis(
    p_start_date DATE,
    p_end_date DATE
) RETURNS TABLE (
    period DATE,
    total_invoiced DECIMAL,
    total_paid DECIMAL,
    outstanding_amount DECIMAL,
    average_invoice_value DECIMAL,
    payment_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH invoice_stats AS (
        SELECT
            DATE_TRUNC('month', invoice_date) as period,
            SUM(total_amount) as total_invoiced,
            SUM(paid_amount) as total_paid,
            SUM(total_amount - paid_amount) as outstanding_amount,
            AVG(total_amount) as average_invoice_value,
            COUNT(*) as invoice_count
        FROM tenant_schema.invoices
        WHERE invoice_date BETWEEN p_start_date AND p_end_date
        GROUP BY DATE_TRUNC('month', invoice_date)
    )
    SELECT
        period::DATE,
        total_invoiced,
        total_paid,
        outstanding_amount,
        average_invoice_value,
        CASE
            WHEN total_invoiced > 0 THEN (total_paid / total_invoiced * 100)::DECIMAL
            ELSE 0
        END as payment_rate
    FROM invoice_stats
    ORDER BY period;
END;
$$ LANGUAGE plpgsql;
```

## Data Security

### Row-Level Security

```sql
-- Enable RLS
ALTER TABLE tenant_schema.medical_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY medical_records_select_policy ON tenant_schema.medical_records
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM system.user_permissions
            WHERE user_id = current_setting('app.current_user_id')::UUID
            AND (
                permission = 'VIEW_ALL_MEDICAL_RECORDS'
                OR (
                    permission = 'VIEW_OWN_MEDICAL_RECORDS'
                    AND created_by = current_setting('app.current_user_id')::UUID
                )
            )
        )
    );

CREATE POLICY medical_records_insert_policy ON tenant_schema.medical_records
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM system.user_permissions
            WHERE user_id = current_setting('app.current_user_id')::UUID
            AND permission = 'CREATE_MEDICAL_RECORDS'
        )
    );
```

### Data Encryption

```csharp
public class EncryptionService : IEncryptionService
{
    private readonly IDataProtectionProvider _dataProtectionProvider;
    private readonly IConfiguration _configuration;

    public string EncryptSensitiveData(string plainText)
    {
        var protector = _dataProtectionProvider.CreateProtector("SensitiveData");
        return protector.Protect(plainText);
    }

    public string DecryptSensitiveData(string cipherText)
    {
        var protector = _dataProtectionProvider.CreateProtector("SensitiveData");
        return protector.Unprotect(cipherText);
    }
}

// Entity configuration with encryption
public class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.Property(p => p.MicrochipId)
            .HasConversion(
                v => _encryptionService.EncryptSensitiveData(v),
                v => _encryptionService.DecryptSensitiveData(v)
            );
    }
}
```

## Backup and Recovery

### Backup Strategy

```sql
-- Tenant-specific backup function
CREATE OR REPLACE FUNCTION system.backup_tenant(
    p_tenant_id UUID,
    p_backup_location TEXT
) RETURNS TEXT AS $$
DECLARE
    v_schema_name TEXT;
    v_backup_file TEXT;
BEGIN
    -- Get schema name
    SELECT schema_name INTO v_schema_name
    FROM system.tenants
    WHERE id = p_tenant_id;

    -- Create backup file name
    v_backup_file := format('%s/tenant_%s_%s.sql',
        p_backup_location,
        p_tenant_id,
        TO_CHAR(NOW(), 'YYYYMMDD_HH24MISS')
    );

    -- Execute pg_dump for specific schema
    EXECUTE format(
        'COPY (SELECT pg_dump -Fc -n %I -f %L)',
        v_schema_name,
        v_backup_file
    );

    RETURN v_backup_file;
END;
$$ LANGUAGE plpgsql;
```

### Point-in-Time Recovery

```csharp
public class BackupService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<BackupService> _logger;

    public async Task<string> CreateTenantBackupAsync(Guid tenantId)
    {
        var tenant = await _dbContext.Tenants.FindAsync(tenantId);
        var backupPath = Path.Combine(_configuration["Backup:Path"], $"tenant_{tenantId}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.backup");

        var processStartInfo = new ProcessStartInfo
        {
            FileName = "pg_dump",
            Arguments = $"-Fc -n {tenant.SchemaName} -f {backupPath} {_configuration.GetConnectionString("DefaultConnection")}",
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false
        };

        using var process = Process.Start(processStartInfo);
        await process.WaitForExitAsync();

        if (process.ExitCode != 0)
        {
            var error = await process.StandardError.ReadToEndAsync();
            throw new Exception($"Backup failed: {error}");
        }

        return backupPath;
    }
}
```

## Performance Monitoring

### Query Performance

```sql
-- Create extension for query statistics
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Monitor slow queries
CREATE OR REPLACE VIEW system.slow_queries AS
SELECT
    query,
    calls,
    total_time / 1000 as total_seconds,
    mean_time / 1000 as mean_seconds,
    rows
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
ORDER BY mean_time DESC
LIMIT 20;

-- Index usage statistics
CREATE OR REPLACE VIEW system.index_usage AS
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE schemaname LIKE 'tenant_%'
ORDER BY idx_scan ASC;
```

### Database Health Monitoring

```csharp
public class DatabaseHealthCheck : IHealthCheck
{
    private readonly TenantDbContext _dbContext;

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Check database connection
            await _dbContext.Database.CanConnectAsync(cancellationToken);

            // Check query performance
            var slowQueryCount = await _dbContext.Database
                .SqlQuery<int>($"SELECT COUNT(*) FROM system.slow_queries WHERE mean_seconds > 1")
                .FirstOrDefaultAsync(cancellationToken);

            if (slowQueryCount > 10)
            {
                return HealthCheckResult.Degraded($"High number of slow queries detected: {slowQueryCount}");
            }

            // Check disk space
            var diskSpace = await _dbContext.Database
                .SqlQuery<DatabaseSpace>($"SELECT pg_database_size(current_database()) as size")
                .FirstOrDefaultAsync(cancellationToken);

            return HealthCheckResult.Healthy($"Database size: {diskSpace.Size / 1024 / 1024} MB");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Database check failed", ex);
        }
    }
}
```

## Data Retention and Archiving

### Archiving Strategy

```sql
-- Create archive schema
CREATE SCHEMA archive;

-- Archive old appointments
CREATE OR REPLACE FUNCTION tenant_schema.archive_old_appointments(
    p_cutoff_date DATE
) RETURNS INTEGER AS $$
DECLARE
    v_archived_count INTEGER;
BEGIN
    -- Move old appointments to archive
    WITH archived AS (
        DELETE FROM tenant_schema.appointments
        WHERE scheduled_end < p_cutoff_date
        AND status IN ('COMPLETED', 'CANCELED', 'NO_SHOW')
        RETURNING *
    )
    INSERT INTO archive.appointments
    SELECT * FROM archived;

    GET DIAGNOSTICS v_archived_count = ROW_COUNT;

    RETURN v_archived_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule archiving
CREATE OR REPLACE FUNCTION tenant_schema.schedule_archiving()
RETURNS void AS $$
BEGIN
    -- Archive appointments older than 2 years
    PERFORM tenant_schema.archive_old_appointments(CURRENT_DATE - INTERVAL '2 years');

    -- Archive medical records older than 7 years
    PERFORM tenant_schema.archive_old_medical_records(CURRENT_DATE - INTERVAL '7 years');
END;
$$ LANGUAGE plpgsql;
```

## Conclusion

The VetPMS data architecture provides a robust foundation for veterinary practice management with:

1. **Multi-tenant Isolation**: Secure schema-per-tenant approach
2. **Performance Optimization**: Materialized views, partitioning, and indexing
3. **Data Security**: Row-level security and encryption
4. **Audit Trail**: Comprehensive change tracking
5. **Search Capabilities**: Elasticsearch integration for fast searches
6. **Analytics Support**: Built-in reporting functions
7. **Migration Tools**: Smooth transition from Animana
8. **Backup/Recovery**: Tenant-specific backup strategies

This design ensures data integrity, security, and performance while supporting the complex requirements of modern veterinary practices.
