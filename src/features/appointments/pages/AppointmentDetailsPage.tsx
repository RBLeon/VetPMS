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

export function AppointmentDetailsPage() {
  useParams();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Afspraak</h1>
          <p className="text-muted-foreground">
            Details en behandeling van afspraak
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Afdrukken
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nieuwe behandeling
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aangemeld</div>
            <p className="text-xs text-muted-foreground">
              Wachtend op behandeling
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tijd</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">09:00 - 09:30</div>
            <p className="text-xs text-muted-foreground">Vandaag</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dierenarts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Dhr. Jansen</div>
            <p className="text-xs text-muted-foreground">Onderzoekskamer 1</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Controle</div>
            <p className="text-xs text-muted-foreground">Routine check-up</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="treatment">Behandeling</TabsTrigger>
          <TabsTrigger value="notes">Notities</TabsTrigger>
          <TabsTrigger value="history">Geschiedenis</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Afspraak Details</CardTitle>
              <CardDescription>
                Algemene informatie over de afspraak
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Patiënt</h3>
                  <p>Max (Hond)</p>
                </div>
                <div>
                  <h3 className="font-semibold">Eigenaar</h3>
                  <p>Jan de Vries</p>
                </div>
                <div>
                  <h3 className="font-semibold">Reden</h3>
                  <p>Jaarlijkse controle</p>
                </div>
                <div>
                  <h3 className="font-semibold">Notities</h3>
                  <p>Laatste vaccinatie was 6 maanden geleden</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="treatment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Behandeling</CardTitle>
              <CardDescription>Details van de behandeling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Behandeling details in ontwikkeling...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notities</CardTitle>
              <CardDescription>Notities en observaties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Notities in ontwikkeling...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geschiedenis</CardTitle>
              <CardDescription>
                Eerdere afspraken en behandelingen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Geschiedenis in ontwikkeling...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
