import { format } from "date-fns";
import { nl } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/ui/components/card";
import { Badge } from "@/features/ui/components/badge";
import { ScrollArea } from "@/features/ui/components/scroll-area";

interface FollowUp {
  id: string;
  date: string;
  time: string;
  notes: string;
  status: "ACTIEF" | "OPGELOST" | "IN_AFWACHTING" | "GEANNULEERD";
}

export interface FollowUpHistoryProps {
  recordId: string;
}

export function FollowUpHistory({ recordId }: FollowUpHistoryProps) {
  // TODO: Implement fetching follow-ups for the record
  const followUps: FollowUp[] = [];

  const formatDate = (date: string) => {
    return format(new Date(date), "d MMMM yyyy", { locale: nl });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Controle Afspraken</CardTitle>
        <div className="text-sm text-muted-foreground">
          Record ID: {recordId}
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
