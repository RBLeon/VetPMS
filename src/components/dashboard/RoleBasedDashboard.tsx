import React from "react";
import { useRole } from "../../lib/context/RoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  FileText, 
  Stethoscope, 
  BarChart3, 
  Database,
  CreditCard,
  CheckSquare,
  ClipboardList,
  UserPlus,
  Heart,
  Settings
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/**
 * RoleBasedDashboard displays different dashboard content based on user role
 * Leverages the roleConfigs to determine what components and quick actions to show
 */
export function RoleBasedDashboard() {
  const { role, roleConfig } = useRole();

  if (!roleConfig?.contextualFeatures?.useRoleBasedDashboard) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Role-based dashboard is not enabled for your role.
        </p>
      </div>
    );
  }

  // Return different dashboard based on role
  switch(role) {
    case 'veterinarian':
      return <VeterinarianDashboard />;
    case 'receptionist':
      return <ReceptionistDashboard />;
    case 'nurse':
      return <NurseDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <DefaultDashboard />;
  }
}

// Role-specific dashboard implementations
function VeterinarianDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Veterinarian Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Today's Schedule
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Next: Bella (Labrador) @ 10:30 AM
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Test Results</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Lab results expected by 2:00 PM
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Patients</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Max (German Shepherd) - Post-surgery monitoring
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-4">Recent Patients</h3>
      <div className="space-y-4">
        {[1, 2, 3].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="flex">
              <div className="p-4 w-2/3">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{["MX", "BL", "CH"][i]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{["Max", "Bella", "Charlie"][i]}</h4>
                    <p className="text-sm text-muted-foreground">{["German Shepherd", "Labrador", "Maine Coon"][i]}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm">
                    {["Post-operative care for TPLO surgery", "Routine checkup and vaccinations", "Respiratory issue follow-up"][i]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last visit: {["Today", "Yesterday", "3 days ago"][i]}
                  </p>
                </div>
              </div>
              <div className="w-1/3 bg-muted p-4 border-l">
                <h5 className="text-sm font-medium mb-2">Quick Actions</h5>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">Medical Record</span>
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <Stethoscope className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">New SOAP Note</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ReceptionistDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reception Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Today's Schedule
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              4 checked in, 20 remaining
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting Room</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Avg wait time: 12 min
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Total: $1,240.00
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Callbacks Needed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              3 follow-ups, 4 reminders
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Check-In Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["10:00 AM - Max (Dr. Wilson)", "10:15 AM - Bella (Dr. Martinez)", "10:30 AM - Charlie (Dr. Wilson)"].map((appointment, i) => (
              <div key={i} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${i === 0 ? "bg-red-500" : "bg-green-500"}`} />
                  <span>{appointment}</span>
                </div>
                <Button size="sm" variant="ghost">
                  <CheckSquare className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button className="flex flex-col items-center justify-center h-20 space-y-1">
                <UserPlus className="h-6 w-6" />
                <span className="text-xs">New Client</span>
              </Button>
              <Button className="flex flex-col items-center justify-center h-20 space-y-1">
                <Calendar className="h-6 w-6" />
                <span className="text-xs">Schedule Appointment</span>
              </Button>
              <Button className="flex flex-col items-center justify-center h-20 space-y-1">
                <CheckSquare className="h-6 w-6" />
                <span className="text-xs">Check-In</span>
              </Button>
              <Button className="flex flex-col items-center justify-center h-20 space-y-1">
                <CreditCard className="h-6 w-6" />
                <span className="text-xs">Process Payment</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NurseDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Nurse Dashboard</h2>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Tasks
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 urgent, 5 standard
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Under Care</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              2 needing vitals check
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medication Schedule</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              Next: Room 3 at 11:00 AM
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Treatment Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { time: "11:00 AM", patient: "Max", task: "IV Medication", room: "Room 3", priority: "high" },
            { time: "11:30 AM", patient: "Bella", task: "Post-op check", room: "Room 1", priority: "medium" },
            { time: "12:00 PM", patient: "Charlie", task: "Bandage change", room: "Room 4", priority: "medium" },
          ].map((task, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === "high" ? "bg-red-500" : 
                  task.priority === "medium" ? "bg-amber-500" : "bg-green-500"
                }`} />
                <div>
                  <p className="font-medium">{task.time} - {task.patient}</p>
                  <p className="text-sm text-muted-foreground">{task.task} ({task.room})</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Complete</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Practice Manager Dashboard</h2>
        <Button variant="outline" size="sm">
          <BarChart3 className="mr-2 h-4 w-4" />
          Full Reports
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,240</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              4 new clients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff On Duty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 vets, 2 nurses, 3 support
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Items below reorder level
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Revenue Chart Placeholder</p>
              <p className="text-xs text-muted-foreground mt-2">Exams: 45%, Surgery: 30%, Labs: 15%, Other: 10%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Notices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: "Staff Meeting", message: "Tomorrow at 8:30 AM in the conference room" },
              { title: "Inventory Order", message: "Surgical supplies arriving Thursday" },
              { title: "Quarterly Review", message: "Financial review due next Friday" }
            ].map((notice, i) => (
              <div key={i} className="p-3 border rounded-md">
                <h4 className="font-medium">{notice.title}</h4>
                <p className="text-sm text-muted-foreground">{notice.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">System Administrator Dashboard</h2>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          System Settings
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CircuitBoard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Healthy</div>
            <p className="text-xs text-muted-foreground">
              All services operational
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">
              Currently logged in
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Storage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              32% free space remaining
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Updates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Security patch and UI update
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Monitoring</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Performance Graph Placeholder</p>
              <p className="text-xs text-muted-foreground mt-2">CPU: 32%, Memory: 48%, Network: Stable</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { type: "info", message: "Daily backup completed successfully", time: "3:00 AM" },
              { type: "warning", message: "High database load detected", time: "Yesterday, 2:34 PM" },
              { type: "error", message: "Failed login attempts (IP: 192.168.1.45)", time: "Yesterday, 10:12 AM" }
            ].map((alert, i) => (
              <div key={i} className={`p-3 border rounded-md ${
                alert.type === "error" ? "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/30" :
                alert.type === "warning" ? "border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-900/30" :
                "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900/30"
              }`}>
                <div className="flex justify-between">
                  <p className={`font-medium ${
                    alert.type === "error" ? "text-red-700 dark:text-red-300" :
                    alert.type === "warning" ? "text-amber-700 dark:text-amber-300" :
                    "text-blue-700 dark:text-blue-300"
                  }`}>{alert.message}</p>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DefaultDashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Welcome to VetConnect</h2>
      <Card>
        <CardContent className="pt-6">
          <p>Please select an action from the navigation menu or quick actions below.</p>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card className="flex flex-col items-center justify-center p-6 hover:bg-muted/50 cursor-pointer">
          <Calendar className="h-8 w-8 mb-2 text-blue-500" />
          <p className="text-sm font-medium">Appointments</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 hover:bg-muted/50 cursor-pointer">
          <Users className="h-8 w-8 mb-2 text-teal-500" />
          <p className="text-sm font-medium">Clients</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 hover:bg-muted/50 cursor-pointer">
          <Stethoscope className="h-8 w-8 mb-2 text-amber-500" />
          <p className="text-sm font-medium">Medical Records</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 hover:bg-muted/50 cursor-pointer">
          <Settings className="h-8 w-8 mb-2 text-slate-500" />
          <p className="text-sm font-medium">Settings</p>
        </Card>
      </div>
    </div>
  );
}

// Import statements for CircuitBoard icon missing from original imports
function CircuitBoard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M11 9h4a2 2 0 0 0 2-2V3" />
      <circle cx="9" cy="9" r="2" />
      <path d="M7 21v-4a2 2 0 0 1 2-2h4" />
      <circle cx="15" cy="15" r="2" />
    </svg>
  );
}