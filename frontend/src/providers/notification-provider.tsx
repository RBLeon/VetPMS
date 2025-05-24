import { NotificationProvider } from "@refinedev/core";
import { toast } from "@/components/ui/use-toast";

export const notificationProvider: NotificationProvider = {
  open: ({ message, type, key }) => {
    const title = key ? key.charAt(0).toUpperCase() + key.slice(1) : undefined;

    toast({
      title,
      description: message,
      variant: type === "error" ? "destructive" : "default",
    });

    return { key: key || message };
  },
  close: () => {
    // No specific close action needed for our toast implementation
    return;
  },
};
