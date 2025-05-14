import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalRecordDetails } from "@/features/medical-records/MedicalRecordDetails";
import { PrescriptionForm } from "@/features/medical-records/PrescriptionForm";
import { FollowUpForm } from "@/features/medical-records/FollowUpForm";
import { FileAttachmentForm } from "@/features/medical-records/FileAttachmentForm";

export function MedicalRecordDetailsPage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Medisch Dossier</h1>
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
            Nieuwe behandeling
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Laatste behandeling
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
          <TabsTrigger value="prescriptions">Recepten</TabsTrigger>
          <TabsTrigger value="followups">Vervolgafspraken</TabsTrigger>
          <TabsTrigger value="attachments">Bijlagen</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dossier Details</CardTitle>
              <CardDescription>
                Algemene informatie over het medisch dossier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MedicalRecordDetails recordId={id || ""} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="prescriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recepten</CardTitle>
              <CardDescription>Beheer recepten en medicatie</CardDescription>
            </CardHeader>
            <CardContent>
              <PrescriptionForm onAdd={() => {}} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="followups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vervolgafspraken</CardTitle>
              <CardDescription>Plan en beheer vervolgafspraken</CardDescription>
            </CardHeader>
            <CardContent>
              <FollowUpForm
                recordDate={new Date().toISOString()}
                onSchedule={() => {}}
                onCancel={() => {}}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attachments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bijlagen</CardTitle>
              <CardDescription>Beheer bestanden en documenten</CardDescription>
            </CardHeader>
            <CardContent>
              <FileAttachmentForm
                attachments={[]}
                onAdd={() => {}}
                onRemove={() => {}}
                isSubmitting={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
