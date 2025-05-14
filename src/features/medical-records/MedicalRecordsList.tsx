import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMedicalRecords, usePatients } from "@/lib/hooks/useApi";
import { PageHeader } from "@/features/ui/components/page-header";
import { Button } from "@/features/ui/components/button";
import { Input } from "@/features/ui/components/input";
import { Card, CardContent } from "@/features/ui/components/card";
import { Badge } from "@/features/ui/components/badge";
import { ScrollArea } from "@/features/ui/components/scroll-area";
import { Tabs, TabsContent } from "@/features/ui/components/tabs";
import { Checkbox } from "@/features/ui/components/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/features/ui/components/hover-card";
import { Plus, Filter, Download, Printer, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/features/ui/components/label";
import { MedicalRecord } from "@/lib/api/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/ui/components/select";

interface MedicalRecordsListProps {
  patientId: string;
}

export const MedicalRecordsList: React.FC<MedicalRecordsListProps> = ({
  patientId,
}) => {
  const navigate = useNavigate();
  const { data: allRecords = [], isLoading } = useMedicalRecords();
  const { data: allPatients = [] } = usePatients();
  const records = allRecords.filter(
    (record: MedicalRecord) => record.patientId === patientId
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALLE");
  const [view, setView] = useState<"list" | "timeline">("list");

  const filteredRecords = React.useMemo(() => {
    let filtered = records;
    if (statusFilter && statusFilter !== "ALLE") {
      filtered = filtered.filter(
        (record: MedicalRecord) => record.status === statusFilter
      );
    }
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter((record: MedicalRecord) => {
        const patient = allPatients.find((p) => p.id === record.patientId);
        return (
          record.type.toLowerCase().includes(searchTermLower) ||
          (record.notes?.toLowerCase() || "").includes(searchTermLower) ||
          record.chiefComplaint.toLowerCase().includes(searchTermLower) ||
          (record.diagnosis?.toLowerCase() || "").includes(searchTermLower) ||
          (patient?.name?.toLowerCase() || "").includes(searchTermLower)
        );
      });
    }
    return filtered;
  }, [records, searchTerm, statusFilter, allPatients]);

  const stats = React.useMemo(() => {
    return {
      total: records.length,
      actief: records.filter((r: MedicalRecord) => r.status === "ACTIEF")
        .length,
      opgelost: records.filter((r: MedicalRecord) => r.status === "OPGELOST")
        .length,
      inAfwachting: records.filter(
        (r: MedicalRecord) => r.status === "IN_AFWACHTING"
      ).length,
      geannuleerd: records.filter(
        (r: MedicalRecord) => r.status === "GEANNULEERD"
      ).length,
    };
  }, [records]);

  const handleRecordSelect = (recordId: string) => {
    setSelectedRecords((prev) =>
      prev.includes(recordId)
        ? prev.filter((id) => id !== recordId)
        : [...prev, recordId]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Laden...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Medische Dossiers"
        description="Bekijk en beheer patiëntendossiers"
      >
        <Button onClick={() => navigate(`/patients/${patientId}/records/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Nieuw Dossier
        </Button>
      </PageHeader>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Zoek Dossiers
            </Label>
            <Input
              id="search"
              placeholder="Zoek in dossiers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              role="searchbox"
              data-testid="search-input"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="min-w-[200px]">
          <Label htmlFor="status-filter" className="block mb-1">
            Status
          </Label>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            name="status"
          >
            <SelectTrigger
              id="status-filter"
              aria-label="Status"
              role="combobox"
              data-testid="status-filter"
            >
              <SelectValue placeholder="Alle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALLE">Alle</SelectItem>
              <SelectItem value="ACTIEF">Actief</SelectItem>
              <SelectItem value="OPGELOST">Opgelost</SelectItem>
              <SelectItem value="IN_AFWACHTING">In afwachting</SelectItem>
              <SelectItem value="GEANNULEERD">Geannuleerd</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={statusFilter === "ALLE" ? "default" : "outline"}
          onClick={() => setStatusFilter("ALLE")}
          data-testid="filter-alle"
        >
          Alle
        </Button>
        <Button
          variant={statusFilter === "ACTIEF" ? "default" : "outline"}
          onClick={() => setStatusFilter("ACTIEF")}
          data-testid="filter-actief"
        >
          Actief
        </Button>
        <Button
          variant={statusFilter === "OPGELOST" ? "default" : "outline"}
          onClick={() => setStatusFilter("OPGELOST")}
          data-testid="filter-opgelost"
        >
          Opgelost
        </Button>
        <Button
          variant={statusFilter === "IN_AFWACHTING" ? "default" : "outline"}
          onClick={() => setStatusFilter("IN_AFWACHTING")}
          data-testid="filter-in-afwachting"
        >
          In afwachting
        </Button>
        <Button
          variant={statusFilter === "GEANNULEERD" ? "default" : "outline"}
          onClick={() => setStatusFilter("GEANNULEERD")}
          data-testid="filter-geannuleerd"
        >
          Geannuleerd
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Totaal</div>
            <div className="text-2xl font-bold" data-testid="stat-totaal">
              {stats.total}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Actief</div>
            <div className="text-2xl font-bold" data-testid="stat-actief">
              {stats.actief}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Opgelost</div>
            <div className="text-2xl font-bold" data-testid="stat-opgelost">
              {stats.opgelost}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">In afwachting</div>
            <div
              className="text-2xl font-bold"
              data-testid="stat-in-afwachting"
            >
              {stats.inAfwachting}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Geannuleerd</div>
            <div className="text-2xl font-bold" data-testid="stat-geannuleerd">
              {stats.geannuleerd}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedRecords.length > 0 && (
        <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
          <span className="text-sm font-medium">
            {selectedRecords.length} geselecteerd
          </span>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporteer Selectie
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print Selectie
          </Button>
        </div>
      )}

      <Tabs
        value={view}
        onValueChange={(v) => setView(v as "list" | "timeline")}
      >
        <TabsContent value="list" className="mt-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {filteredRecords.map((record) => {
                const patient = allPatients.find(
                  (p) => p.id === record.patientId
                );
                return (
                  <HoverCard key={record.id}>
                    <HoverCardTrigger asChild>
                      <Card
                        className="cursor-pointer"
                        data-testid="record-card"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Checkbox
                              checked={selectedRecords.includes(record.id)}
                              onCheckedChange={() =>
                                handleRecordSelect(record.id)
                              }
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3
                                    className="font-medium"
                                    data-testid="patient-name"
                                  >
                                    {patient?.name || "Onbekende patiënt"}
                                  </h3>
                                  <p
                                    className="text-sm text-muted-foreground"
                                    data-testid="record-type"
                                  >
                                    {record.type} -{" "}
                                    {format(new Date(record.date), "PPP")}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      record.status === "ACTIEF"
                                        ? "default"
                                        : record.status === "OPGELOST"
                                        ? "secondary"
                                        : record.status === "IN_AFWACHTING"
                                        ? "outline"
                                        : "outline"
                                    }
                                    data-testid="record-status"
                                  >
                                    {record.status === "ACTIEF"
                                      ? "Actief"
                                      : record.status === "OPGELOST"
                                      ? "Opgelost"
                                      : record.status === "IN_AFWACHTING"
                                      ? "In afwachting"
                                      : "Geannuleerd"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent data-testid="hover-details">
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-medium">Patiënt</h4>
                          <p>{patient?.name || "Onbekende patiënt"}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Hoofdklacht</h4>
                          <p>{record.chiefComplaint}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Diagnose</h4>
                          <p>{record.diagnosis}</p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="timeline" className="mt-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-8">
              {Object.entries(
                filteredRecords.reduce<Record<string, MedicalRecord[]>>(
                  (acc, record) => {
                    const month = format(new Date(record.date), "MMMM yyyy");
                    if (!acc[month]) {
                      acc[month] = [];
                    }
                    acc[month].push(record);
                    return acc;
                  },
                  {}
                )
              ).map(([month, records]) => (
                <div key={month}>
                  <h3 className="text-lg font-medium mb-4">{month}</h3>
                  <div className="space-y-2">
                    {records.map((record) => {
                      const patient = allPatients.find(
                        (p) => p.id === record.patientId
                      );
                      return (
                        <Card key={record.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">
                                  {patient?.name || "Onbekende patiënt"}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {record.type} -{" "}
                                  {format(new Date(record.date), "PPP")}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  record.status === "ACTIEF"
                                    ? "default"
                                    : record.status === "OPGELOST"
                                    ? "secondary"
                                    : record.status === "IN_AFWACHTING"
                                    ? "outline"
                                    : "outline"
                                }
                              >
                                {record.status === "ACTIEF"
                                  ? "Actief"
                                  : record.status === "OPGELOST"
                                  ? "Opgelost"
                                  : record.status === "IN_AFWACHTING"
                                  ? "In afwachting"
                                  : "Geannuleerd"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
