import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Pagina Niet Gevonden</h1>
      <p className="mb-4">De pagina die u zoekt bestaat niet.</p>
      <Link to="/" className="text-blue-500 hover:text-blue-700">
        Terug naar Home
      </Link>
    </div>
  );
}
