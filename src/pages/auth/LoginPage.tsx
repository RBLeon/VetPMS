import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/hooks/useAuth";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/role-selection");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-6xl font-bold mb-8 text-primary">VetPMS</h1>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Inloggen</CardTitle>
          <CardDescription>Voer uw gegevens in om in te loggen</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="E-mailadres"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Wachtwoord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
            <Button type="submit" className="w-full">
              Inloggen
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/forgot-password")}
            >
              Wachtwoord vergeten?
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Demo Credentials:
        <br />
        Email: demo@vetpms.nl
        <br />
        Password: demo123
      </div>
    </div>
  );
};
