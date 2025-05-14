import { useNavigate } from "react-router-dom";
import { useCreateClient, useUpdateClient } from "@/lib/hooks/useApi";
import { PageHeader } from "@/features/ui/components/page-header";
import { Button } from "@/features/ui/components/button";
import { Input } from "@/features/ui/components/input";
import { Label } from "@/features/ui/components/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/ui/components/card";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/ui/components/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Client } from "@/lib/api/types";

const schema = z.object({
  firstName: z.string().min(1, "Voornaam is verplicht"),
  lastName: z.string().min(1, "Achternaam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  phone: z.string().min(1, "Telefoonnummer is verplicht"),
  address: z.object({
    street: z.string().min(1, "Straat is verplicht"),
    city: z.string().min(1, "Stad is verplicht"),
    state: z.string().min(1, "Provincie is verplicht"),
    country: z.string().min(1, "Land is verplicht"),
    postalCode: z.string().min(1, "Postcode is verplicht"),
  }),
  preferredCommunication: z.enum(["email", "phone", "sms"]),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ClientFormProps {
  clientId?: string;
}

export function ClientForm({ clientId }: ClientFormProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      preferredCommunication: "email",
    },
  });

  const { mutate: createClient, isPending: isCreating } = useCreateClient();
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();

  const onSubmit = (data: FormData) => {
    const clientData: Omit<Client, "id"> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      preferredCommunication: data.preferredCommunication,
      notes: data.notes,
      lastVisit: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (clientId) {
      updateClient({ id: clientId, data: clientData });
    } else {
      createClient(clientData);
    }
    navigate("/clients");
  };

  return (
    <div className="container mx-auto py-6 space-y-4">
      <PageHeader
        title={clientId ? "Klant Bewerken" : "Nieuwe Klant Toevoegen"}
        description="Voeg klantgegevens toe of werk deze bij"
      >
        <Button
          variant="outline"
          onClick={() => navigate("/clients")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar Klanten
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Klantgegevens</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">Voornaam</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  error={errors.firstName?.message}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Achternaam</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  error={errors.lastName?.message}
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefoon</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  error={errors.phone?.message}
                />
              </div>
              <div>
                <Label htmlFor="address.street">Straat</Label>
                <Input
                  id="address.street"
                  {...register("address.street")}
                  error={errors.address?.street?.message}
                />
              </div>
              <div>
                <Label htmlFor="address.city">Stad</Label>
                <Input
                  id="address.city"
                  {...register("address.city")}
                  error={errors.address?.city?.message}
                />
              </div>
              <div>
                <Label htmlFor="address.state">Provincie</Label>
                <Input
                  id="address.state"
                  {...register("address.state")}
                  error={errors.address?.state?.message}
                />
              </div>
              <div>
                <Label htmlFor="address.country">Land</Label>
                <Input
                  id="address.country"
                  {...register("address.country")}
                  error={errors.address?.country?.message}
                />
              </div>
              <div>
                <Label htmlFor="address.postalCode">Postcode</Label>
                <Input
                  id="address.postalCode"
                  {...register("address.postalCode")}
                  error={errors.address?.postalCode?.message}
                />
              </div>
              <div>
                <Label htmlFor="preferredCommunication">
                  Voorkeur Communicatie
                </Label>
                <Select
                  onValueChange={(value) =>
                    register("preferredCommunication").onChange({
                      target: { value },
                    })
                  }
                  defaultValue="email"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer voorkeur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="phone">Telefoon</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/clients")}
              >
                Annuleren
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Bezig met opslaan..." : "Opslaan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
