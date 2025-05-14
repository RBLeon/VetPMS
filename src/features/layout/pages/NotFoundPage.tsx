import { Button } from "@/features/ui/components/button";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Pagina niet gevonden</p>
      <Button onClick={() => navigate("/")}>Terug naar Dashboard</Button>
    </div>
  );
};
