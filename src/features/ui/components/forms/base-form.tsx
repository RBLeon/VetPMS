import { ReactNode } from "react";
import {
  useForm,
  FieldValues,
  UseFormReturn,
  Path,
  SubmitHandler,
  UseFormProps,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Button } from "../button";

export interface BaseFormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: T;
  onSubmit: SubmitHandler<T>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
  children: ReactNode;
  isLoading?: boolean;
}

export function BaseForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Opslaan",
  cancelLabel = "Annuleren",
  className = "",
  children,
  isLoading = false,
}: BaseFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as UseFormProps<T>["defaultValues"],
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit as SubmitHandler<FieldValues>)}
        className={`space-y-6 ${className}`}
      >
        {children}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Bezig met opslaan..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function FormFieldWrapper<T extends FieldValues>({
  name,
  label,
  control,
  children,
}: {
  name: Path<T>;
  label: string;
  control: UseFormReturn<T>["control"];
  children: React.ReactNode;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>{children}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
