import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/context/AuthContext";
import { usePets } from "./usePets";
import { Button } from "@/features/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/ui/components/form";
import { Input } from "@/features/ui/components/input";
import { useToast } from "@/features/ui/components/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Naam is verplicht"),
  species: z.string().min(1, "Soort is verplicht"),
  breed: z.string().min(1, "Ras is verplicht"),
  birthDate: z.string().min(1, "Geboortedatum is verplicht"),
});

export function AddPet() {
  const { user } = useAuth();
  const { addPet } = usePets();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      birthDate: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!user) {
        throw new Error("Gebruiker niet ingelogd");
      }
      await addPet({
        ...data,
        ownerId: user.id,
      });
      toast({
        title: "Succes",
        description: "Huisdier succesvol toegevoegd",
      });
      navigate("/pets");
    } catch (error) {
      toast({
        title: "Fout",
        description:
          "Er is een fout opgetreden bij het toevoegen van het huisdier",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nieuw Huisdier</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Naam</FormLabel>
                <FormControl>
                  <Input placeholder="Naam van het huisdier" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soort</FormLabel>
                <FormControl>
                  <Input placeholder="Soort dier" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ras</FormLabel>
                <FormControl>
                  <Input placeholder="Ras van het dier" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geboortedatum</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/pets")}
            >
              Annuleren
            </Button>
            <Button type="submit">Toevoegen</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
