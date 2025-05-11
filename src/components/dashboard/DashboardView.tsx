// src/components/dashboard/DashboardView.tsx
import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { fadeAnimation } from "../../lib/motion";
import { RoleBasedDashboard } from "./RoleBasedDashboard";
import { useRole } from "@/lib/context/RoleContext";

export function DashboardView() {
  const { role } = useRole();
  const [activeSection, setActiveSection] = useState<string | null>(null);

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
        <div className="md:col-span-12">
          <RoleBasedDashboard role={role} />
        </div>
      </div>
    </motion.div>
  );
}
