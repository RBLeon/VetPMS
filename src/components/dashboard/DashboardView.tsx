// src/components/dashboard/DashboardView.tsx
import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import { NavigationHub } from "./NavigationHub";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Calendar,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { fadeAnimation } from "../../lib/motion";
// We need the RoleContext for the RoleBasedDashboard but don't use useRole directly here
import { RoleBasedDashboard } from "./RoleBasedDashboard";
import { FeatureGated } from "../context/AdaptiveContainer";

export function DashboardView() {
  // No need to destructure since we're not using role-specific info in this component
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [notificationsOpen] = useState(false);
  
  return (
    <motion.div 
      className="mx-auto max-w-7xl px-4 py-8 md:px-6"
      initial="hidden"
      animate="show"
      variants={fadeAnimation}
    >
      {/* Display either the role-based dashboard or the traditional dashboard depending on the feature flag */}
      <FeatureGated 
        feature="useRoleBasedDashboard"
        fallback={
          <>
            <div className="mb-8 md:hidden">
              <SearchBar placeholder="Search clients, patients, appointments..." />
            </div>
            
            <div className="grid gap-8 md:grid-cols-12">
              <div className="md:col-span-12 lg:col-span-9">
                <div className="mb-8 hidden md:block">
                  <NavigationHub onSelect={(section) => setActiveSection(section)} activeSection={activeSection} />
                </div>
                
                <RoleBasedDashboard />
              </div>
              
              <div className={cn("md:col-span-12 lg:col-span-3", notificationsOpen ? "block" : "hidden lg:block")}>
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 text-amber-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-medium">Medication Reminder</span>
                        </div>
                        <p className="mt-2 text-sm">Bella is due for medication at 3:00 PM</p>
                        <p className="mt-1 text-xs text-muted-foreground">30 minutes ago</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 text-blue-600">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">Schedule Update</span>
                        </div>
                        <p className="mt-2 text-sm">2 new appointments added for tomorrow</p>
                        <p className="mt-1 text-xs text-muted-foreground">1 hour ago</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Lab Results</span>
                        </div>
                        <p className="mt-2 text-sm">Charlie's blood work results have arrived</p>
                        <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        }
      >
        <RoleBasedDashboard />
      </FeatureGated>
    </motion.div>
  );
}