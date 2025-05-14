import { useParams } from "react-router-dom";
import { Button } from "@/features/ui/components/button";
import { PlusCircle, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/ui/components/tabs";
import { PatientDetails } from "@/features/patients/PatientDetails";

export function PatientDetailsPage() {
  useParams();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Patiënt</h1>
          <p className="text-muted-foreground">
            Details en behandeling van patiënt
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Afdrukken
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nieuwe afspraak
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Laatste bezoek
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 maart 2024</div>
            <p className="text-xs text-muted-foreground">Vaccinatie</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Volgende afspraak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22 maart 2024</div>
            <p className="text-xs text-muted-foreground">Controle</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Openstaande behandelingen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Gebitsreiniging, Vaccinatie
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Laatste update
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Vandaag</div>
            <p className="text-xs text-muted-foreground">
              14:30 door Dr. Smith
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="medical">Medisch</TabsTrigger>
          <TabsTrigger value="appointments">Afspraken</TabsTrigger>
          <TabsTrigger value="billing">Facturatie</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patiënt Details</CardTitle>
              <CardDescription>
                Algemene informatie over de patiënt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientDetails />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="medical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medische Geschiedenis</CardTitle>
              <CardDescription>
                Overzicht van behandelingen en diagnoses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Medische geschiedenis in ontwikkeling...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Afspraken</CardTitle>
              <CardDescription>
                Overzicht van afspraken en behandelingen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Afspraken overzicht in ontwikkeling...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Facturatie</CardTitle>
              <CardDescription>
                Overzicht van facturen en betalingen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Facturatie overzicht in ontwikkeling...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
