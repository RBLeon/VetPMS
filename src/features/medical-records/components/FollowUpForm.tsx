import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/features/ui/components/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/ui/components/card";

const followUpSchema = z.object({
  date: z.string().min(1, "Datum is verplicht"),
  time: z.string().min(1, "Tijd is verplicht"),
  notes: z.string().optional(),
});

type FollowUpFormData = z.infer<typeof followUpSchema>;

export interface FollowUpFormProps {
  recordDate: string;
}

export function FollowUpForm({ recordDate }: FollowUpFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FollowUpFormData>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      date: new Date(recordDate).toISOString().split("T")[0],
      time: "09:00",
      notes: "",
    },
  });

  const handleSubmit = async (data: FollowUpFormData) => {
    try {
      setIsSubmitting(true);
      // TODO: Implement follow-up scheduling
      console.log("Scheduling follow-up:", data);
      form.reset();
    } catch (error) {
      console.error("Error submitting follow-up:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Nieuwe Controle Afspraak</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Datum</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tijd</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notities</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Voeg eventuele notities toe..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Annuleren
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Bezig met plannen..." : "Inplannen"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
