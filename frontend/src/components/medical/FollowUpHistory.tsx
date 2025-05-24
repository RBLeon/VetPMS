import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
}

interface FollowUp {
  id: string;
  date: string;
  time: string;
  notes: string;
  status: "ACTIEF" | "OPGELOST" | "IN_AFWACHTING" | "GEANNULEERD";
}

interface FollowUpHistoryProps {
  patient: Patient;
  followUps: FollowUp[];
}

export function FollowUpHistory({ patient, followUps }: FollowUpHistoryProps) {
  const formatDate = (date: string) => {
    return format(new Date(date), "d MMMM yyyy", { locale: nl });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Controle Afspraken</CardTitle>
        <div className="text-sm text-muted-foreground">
          {patient.name} - {patient.breed} ({patient.species})
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {followUps.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Geen controle afspraken gevonden
            </div>
          ) : (
            <div className="space-y-4">
              {followUps.map((followUp) => (
                <Card key={followUp.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {formatDate(followUp.date)} om {followUp.time}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {followUp.notes}
                        </div>
                      </div>
                      <Badge
                        variant={
                          followUp.status === "OPGELOST"
                            ? "default"
                            : followUp.status === "GEANNULEERD"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {(() => {
                          switch (followUp.status) {
                            case "ACTIEF":
                              return "Actief";
                            case "OPGELOST":
                              return "Opgelost";
                            case "IN_AFWACHTING":
                              return "In afwachting";
                            case "GEANNULEERD":
                              return "Geannuleerd";
                            default:
                              return followUp.status;
                          }
                        })()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
