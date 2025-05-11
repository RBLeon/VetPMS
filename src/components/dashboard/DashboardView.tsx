// src/components/dashboard/DashboardView.tsx
import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { NavigationHub } from "./NavigationHub";
import { cn } from "../../lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { fadeAnimation } from "../../lib/motion";
import { RoleBasedDashboard } from "./RoleBasedDashboard";
import { useAuth } from "@/lib/context/AuthContext";
import { useRole } from "@/lib/context/RoleContext";
import { FeatureGated } from "../context/AdaptiveContainer";

export function DashboardView() {
  const { user } = useAuth();
  const { role } = useRole();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [notificationsOpen] = useState(false);

  return (
    <motion.div
      className="mx-auto max-w-7xl px-4 py-8 md:px-6"
      initial="hidden"
      animate="show"
      variants={fadeAnimation}
    >
      <div className="mb-8 md:hidden">
        <SearchBar placeholder="Zoek klanten, patiënten, afspraken..." />
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-12 lg:col-span-9">
          <div className="mb-8 hidden md:block">
            <NavigationHub
              onSelect={(section) => setActiveSection(section)}
              activeSection={activeSection}
            />
          </div>

          <FeatureGated
            feature="useRoleBasedDashboard"
            fallback={
              <>
                <RoleBasedDashboard role={role} />
              </>
            }
          >
            <RoleBasedDashboard role={role} />
          </FeatureGated>
        </div>

        <div
          className={cn(
            "md:col-span-12 lg:col-span-3",
            notificationsOpen ? "block" : "hidden lg:block"
          )}
        >
          <Card>
            <CardHeader>
              <CardTitle>Meldingen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Medicatie Herinnering</span>
                  </div>
                  <p className="mt-2 text-sm">
                    Bella moet om 15:00 uur medicatie krijgen
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    30 minuten geleden
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Agenda Update</span>
                  </div>
                  <p className="mt-2 text-sm">
                    2 nieuwe afspraken toegevoegd voor morgen
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    1 uur geleden
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Laboratoriumuitslagen</span>
                  </div>
                  <p className="mt-2 text-sm">
                    De bloedonderzoekresultaten van Charlie zijn binnen
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    2 uur geleden
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
