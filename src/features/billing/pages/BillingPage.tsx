import { BillingList } from "@/features/billing/BillingList";
import { Button } from "@/features/ui/components/button";
import { PlusCircle, Download, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/features/ui/components/dropdown-menu";

export function BillingPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Facturatie</h1>
          <p className="text-muted-foreground">
            Beheer alle facturen en betalingen
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Alle facturen</DropdownMenuItem>
              <DropdownMenuItem>Openstaand</DropdownMenuItem>
              <DropdownMenuItem>Betaald</DropdownMenuItem>
              <DropdownMenuItem>Vervallen</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporteer
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nieuwe factuur
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Totaal openstaand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€2,500.00</div>
            <p className="text-xs text-muted-foreground">
              +20.1% van vorige maand
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Deze maand betaald
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€4,200.00</div>
            <p className="text-xs text-muted-foreground">
              +10.5% van vorige maand
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Openstaande facturen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">-2 van vorige maand</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gemiddelde betalingstijd
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 dagen</div>
            <p className="text-xs text-muted-foreground">
              -2 dagen van vorige maand
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Facturen</CardTitle>
          <CardDescription>
            Een overzicht van alle facturen en hun status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BillingList />
        </CardContent>
      </Card>
    </div>
  );
}
