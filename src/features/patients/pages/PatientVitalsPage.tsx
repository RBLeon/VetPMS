import { useParams } from "react-router-dom";
import { Button } from "@/features/ui/components/button";
import { Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/ui/components/card";
import { Input } from "@/features/ui/components/input";
import { Label } from "@/features/ui/components/label";
import { Textarea } from "@/features/ui/components/textarea";

export function PatientVitalsPage() {
  useParams();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vitalen Registreren</h1>
          <p className="text-muted-foreground">
            Registreer en beheer vitale functies van patiënt
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Opslaan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basis Vitalen</CardTitle>
            <CardDescription>
              Registreer de basis vitale functies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperatuur (°C)</Label>
              <Input id="temperature" type="number" step="0.1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heartRate">Hartslag (bpm)</Label>
              <Input id="heartRate" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breathingRate">Ademhaling (per minuut)</Label>
              <Input id="breathingRate" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Gewicht (kg)</Label>
              <Input id="weight" type="number" step="0.1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extra Metingen</CardTitle>
            <CardDescription>Registreer aanvullende metingen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bloodPressure">Bloeddruk (mmHg)</Label>
              <Input id="bloodPressure" placeholder="120/80" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oxygenSaturation">Zuurstofsaturatie (%)</Label>
              <Input id="oxygenSaturation" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capillaryRefill">Capillaire refill (sec)</Label>
              <Input id="capillaryRefill" type="number" step="0.1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mucousMembranes">Slijmvliezen</Label>
              <Input id="mucousMembranes" placeholder="Roze, droog, etc." />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Observaties</CardTitle>
            <CardDescription>Voeg aanvullende observaties toe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="observations">Observaties</Label>
              <Textarea
                id="observations"
                placeholder="Voeg hier uw observaties toe..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
