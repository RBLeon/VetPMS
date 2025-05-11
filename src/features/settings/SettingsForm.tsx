import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface Settings {
  darkMode: boolean;
  notifications: boolean;
  practiceName: string;
  address: string;
  phone: string;
  email: string;
}

export function SettingsForm() {
  const [settings, setSettings] = useState<Settings>({
    darkMode: false,
    notifications: true,
    practiceName: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleToggle = (key: keyof Settings) => {
    if (typeof settings[key] === "boolean") {
      setSettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instellingen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Algemeen</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode">Donker thema</Label>
            <Switch
              id="darkMode"
              checked={settings.darkMode}
              onCheckedChange={() => handleToggle("darkMode")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Notificaties</Label>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={() => handleToggle("notifications")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Praktijkgegevens</h3>
          <div className="space-y-2">
            <Label htmlFor="practiceName">Naam praktijk</Label>
            <Input
              id="practiceName"
              value={settings.practiceName}
              onChange={(e) => handleChange("practiceName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adres</Label>
            <Input
              id="address"
              value={settings.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefoonnummer</Label>
            <Input
              id="phone"
              value={settings.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
