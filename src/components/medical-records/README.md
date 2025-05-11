# Medische Dossiers Functionaliteit

Deze functionaliteit biedt een uitgebreid systeem voor het beheren van medische dossiers voor dierenartspraktijken. Het stelt dierenartsen in staat om medische dossiers voor hun patiënten aan te maken, te bekijken, bij te werken en te verwijderen.

## Componenten

### MedicalRecordsList

Het hoofdcomponent voor het weergeven en beheren van medische dossiers.

#### Props

- `patientId` (string, verplicht): De ID van de patiënt wiens medische dossiers worden weergegeven.

#### Functionaliteiten

- Weergave van medische dossiers in tabelformaat
- Nieuwe medische dossiers toevoegen
- Bestaande medische dossiers bewerken
- Medische dossiers verwijderen
- Filteren van dossiers op datumbereik
- Filteren van dossiers op status
- Sorteren van dossiers op datum
- Ondersteuning voor paginering

#### Gebruik

```tsx
import { MedicalRecordsList } from "@/components/medical-records/MedicalRecordsList";

function PatientPage({ patientId }) {
  return (
    <div>
      <h1>Medische Dossiers Patiënt</h1>
      <MedicalRecordsList patientId={patientId} />
    </div>
  );
}
```

## Hooks

### useMedicalRecords

Een aangepaste hook voor het beheren van medische dossiers en operaties.

#### Parameters

- `patientId` (string, verplicht): De ID van de patiënt wiens medische dossiers worden beheerd.

#### Retourneert

- `medicalRecords` (MedicalRecord[]): Array van medische dossiers
- `isLoading` (boolean): Indicator voor laadstatus
- `error` (string | null): Foutmelding indien aanwezig
- `addMedicalRecord` (function): Functie om een nieuw medisch dossier toe te voegen
- `updateMedicalRecord` (function): Functie om een bestaand medisch dossier bij te werken
- `deleteMedicalRecord` (function): Functie om een medisch dossier te verwijderen

#### Gebruik

```tsx
import { useMedicalRecords } from "@/hooks/useMedicalRecords";

function MedicalRecordsManager({ patientId }) {
  const {
    medicalRecords,
    isLoading,
    error,
    addMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
  } = useMedicalRecords(patientId);

  // Gebruik de geretourneerde waarden en functies van de hook
}
```

## Types

### MedicalRecord

```typescript
interface MedicalRecord {
  id: string;
  patientId: string;
  veterinarianId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  followUpDate: string;
  status: "active" | "resolved" | "pending";
  createdAt: string;
  updatedAt: string;
}
```

## API Endpoints

### GET /api/medical-records

Haalt medische dossiers op voor een specifieke patiënt.

Query Parameters:

- `patientId` (string, verplicht): De ID van de patiënt

### POST /api/medical-records

Maakt een nieuw medisch dossier aan.

Request Body:

```typescript
{
  patientId: string;
  veterinarianId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  followUpDate: string;
  status: "active" | "resolved" | "pending";
}
```

### PUT /api/medical-records/:id

Werkt een bestaand medisch dossier bij.

Request Body:

```typescript
{
  id: string;
  patientId: string;
  veterinarianId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  followUpDate: string;
  status: "active" | "resolved" | "pending";
}
```

### DELETE /api/medical-records/:id

Verwijdert een medisch dossier.

## Toekomstige Verbeteringen

1. Bevestigingsdialoog toevoegen voor verwijderactie
2. Formuliervalidatie toevoegen voor datums (vervolgdatum moet na recorddatum zijn)
3. Laadindicatoren toevoegen voor acties
4. Foutafhandeling toevoegen
5. Unittests toevoegen voor datumvalidatie
6. Integratietests toevoegen voor de volledige flow
7. Toegankelijkheidsfuncties toevoegen
8. Toetsenbordnavigatie toevoegen
9. Tooltips toevoegen voor acties
10. Bulkacties toevoegen (meerdere dossiers verwijderen)
