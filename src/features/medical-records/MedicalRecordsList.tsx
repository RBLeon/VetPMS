import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMedicalRecords } from "@/lib/hooks/useApi";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Plus,
  FileText,
  Calendar,
  Filter,
  Download,
  Printer,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { MedicalRecord } from "@/lib/api/types";

interface MedicalRecordsListProps {
  patientId: string;
}

export const MedicalRecordsList: React.FC<MedicalRecordsListProps> = ({
  patientId,
}) => {
  const navigate = useNavigate();
  const { data: allRecords = [], isLoading } = useMedicalRecords();
  const records = allRecords.filter(
    (record: MedicalRecord) => record.patientId === patientId
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [view, setView] = useState<"list" | "timeline">("list");

  const filteredRecords = React.useMemo(() => {
    return records.filter((record: MedicalRecord) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        record.type.toLowerCase().includes(searchTermLower) ||
        record.notes.toLowerCase().includes(searchTermLower) ||
        record.chiefComplaint.toLowerCase().includes(searchTermLower) ||
        record.diagnosis.toLowerCase().includes(searchTermLower)
      );
    });
  }, [records, searchTerm]);

  const stats = React.useMemo(() => {
    return {
      total: records.length,
      active: records.filter((r: MedicalRecord) => r.status === "ACTIVE")
        .length,
      withPrescriptions: records.filter(
        (r: MedicalRecord) => (r.prescriptions?.length ?? 0) > 0
      ).length,
    };
  }, [records]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleRecordSelect = (recordId: string) => {
    setSelectedRecords((prev) =>
      prev.includes(recordId)
        ? prev.filter((id) => id !== recordId)
        : [...prev, recordId]
    );
  };

  const recordsByMonth = filteredRecords.reduce<
    Record<string, MedicalRecord[]>
  >((acc: Record<string, MedicalRecord[]>, record: MedicalRecord) => {
    const month = format(new Date(record.date), "MMMM yyyy");
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(record);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Medical Records"
        description="View and manage patient medical records"
      >
        <Button onClick={() => navigate(`/patients/${patientId}/records/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          New Record
        </Button>
      </PageHeader>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Search Records
            </Label>
            <Input
              id="search"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as "list" | "timeline")}
        >
          <TabsList>
            <TabsTrigger value="list">
              <FileText className="mr-2 h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Calendar className="mr-2 h-4 w-4" />
              Timeline
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex gap-2">
        <Badge
          variant={activeFilters.includes("ACTIVE") ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => toggleFilter("ACTIVE")}
        >
          Active
        </Badge>
        <Badge
          variant={activeFilters.includes("RESOLVED") ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => toggleFilter("RESOLVED")}
        >
          Resolved
        </Badge>
        <Badge
          variant={
            activeFilters.includes("With Prescriptions") ? "default" : "outline"
          }
          className="cursor-pointer"
          onClick={() => toggleFilter("With Prescriptions")}
        >
          With Prescriptions
        </Badge>
        <Badge
          variant={
            activeFilters.includes("With Attachments") ? "default" : "outline"
          }
          className="cursor-pointer"
          onClick={() => toggleFilter("With Attachments")}
        >
          With Attachments
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Total Records</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Active</div>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">With Prescriptions</div>
            <div className="text-2xl font-bold">{stats.withPrescriptions}</div>
          </CardContent>
        </Card>
      </div>

      {selectedRecords.length > 0 && (
        <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
          <span className="text-sm font-medium">
            {selectedRecords.length} selected
          </span>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Selected
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print Selected
          </Button>
        </div>
      )}

      <TabsContent value="list" className="mt-0">
        <ScrollArea className="h-[600px]">
          <div className="space-y-2">
            {filteredRecords.map((record) => (
              <HoverCard key={record.id}>
                <HoverCardTrigger asChild>
                  <Card className="cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedRecords.includes(record.id)}
                          onCheckedChange={() => handleRecordSelect(record.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{record.type}</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(record.date), "PPP")}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {record.prescriptions &&
                                record.prescriptions.length > 0 && (
                                  <Badge variant="secondary">
                                    Prescription
                                  </Badge>
                                )}
                              {record.status === "ACTIVE" ? (
                                <Badge variant="default">Active</Badge>
                              ) : (
                                <Badge variant="secondary">Resolved</Badge>
                              )}
                            </div>
                          </div>
                          <p className="mt-2 text-sm">
                            {record.chiefComplaint}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-medium">Diagnosis</h4>
                      <p className="text-sm">{record.diagnosis}</p>
                    </div>
                    {record.treatmentPlan && (
                      <div>
                        <h4 className="font-medium">Treatment Plan</h4>
                        <p className="text-sm">{record.treatmentPlan}</p>
                      </div>
                    )}
                    {record.notes && (
                      <div>
                        <h4 className="font-medium">Notes</h4>
                        <p className="text-sm">{record.notes}</p>
                      </div>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="timeline" className="mt-0">
        <ScrollArea className="h-[600px]">
          <div className="space-y-8">
            {Object.entries(recordsByMonth).map(([month, monthRecords]) => (
              <div key={month}>
                <h3 className="text-lg font-medium mb-4">{month}</h3>
                <div className="space-y-2">
                  {monthRecords.map((record) => (
                    <HoverCard key={record.id}>
                      <HoverCardTrigger asChild>
                        <Card className="cursor-pointer">
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
                                    <h3 className="font-medium">
                                      {record.type}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {format(new Date(record.date), "PPP")}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {record.prescriptions &&
                                      record.prescriptions.length > 0 && (
                                        <Badge variant="secondary">
                                          Prescription
                                        </Badge>
                                      )}
                                    {record.status === "ACTIVE" ? (
                                      <Badge variant="default">Active</Badge>
                                    ) : (
                                      <Badge variant="secondary">
                                        Resolved
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="mt-2 text-sm">
                                  {record.chiefComplaint}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-medium">Diagnosis</h4>
                            <p className="text-sm">{record.diagnosis}</p>
                          </div>
                          {record.treatmentPlan && (
                            <div>
                              <h4 className="font-medium">Treatment Plan</h4>
                              <p className="text-sm">{record.treatmentPlan}</p>
                            </div>
                          )}
                          {record.notes && (
                            <div>
                              <h4 className="font-medium">Notes</h4>
                              <p className="text-sm">{record.notes}</p>
                            </div>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </div>
  );
};
