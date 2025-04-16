import React from 'react';
import { RoleProvider, useRole, type Role } from './RoleContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';

// Role selector component
const RoleSelector: React.FC = () => {
  const { role, setRole } = useRole();
  
  const roles = [
    { id: 'veterinarian', name: 'Veterinarian', icon: 'Stethoscope' },
    { id: 'receptionist', name: 'Receptionist', icon: 'Users' },
    { id: 'nurse', name: 'Nurse/Paravet', icon: 'Heart' },
    { id: 'manager', name: 'Practice Manager', icon: 'ChartBar' },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role-Based Interface Demo</CardTitle>
        <CardDescription>
          The interface adapts based on the selected role to show the most relevant information and actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => (
            <Button 
              key={r.id} 
              variant={role === r.id ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={() => setRole(r.id as Role)}
            >
              {r.icon === 'Stethoscope' && '🩺'}
              {r.icon === 'Users' && '👥'}
              {r.icon === 'Heart' && '❤️'}
              {r.icon === 'ChartBar' && '📊'}
              {r.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Content views based on role
const RoleContent: React.FC = () => {
  const { role } = useRole();

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>
          {role === 'veterinarian' && 'Veterinarian View'}
          {role === 'receptionist' && 'Receptionist View'}
          {role === 'nurse' && 'Nurse/Paravet View'}
          {role === 'manager' && 'Practice Manager View'}
        </CardTitle>
        <CardDescription>
          {role === 'veterinarian' && 'Focus on patient care, medical records, and clinical tasks'}
          {role === 'receptionist' && 'Focus on scheduling, client communication, and check-ins'}
          {role === 'nurse' && 'Focus on treatment tasks, monitoring, and clinical support'}
          {role === 'manager' && 'Focus on practice analytics, staff management, and operations'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {role === 'veterinarian' && <VeterinarianContent />}
        {role === 'receptionist' && <ReceptionistContent />}
        {role === 'nurse' && <NurseContent />}
        {role === 'manager' && <ManagerContent />}
      </CardContent>
    </Card>
  );
};

// Role-specific content components
const VeterinarianContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Current Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Bella (Persian Cat)</p>
                <p className="text-sm text-muted-foreground">Owner: Emma Johnson</p>
              </div>
            </div>
            
            <Tabs defaultValue="vital-signs">
              <TabsList className="grid grid-cols-3 mb-2">
                <TabsTrigger value="vital-signs">Vitals</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="meds">Medications</TabsTrigger>
              </TabsList>
              <TabsContent value="vital-signs" className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 border rounded-md">
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className="font-medium">38.6°C</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                    <p className="font-medium">110 bpm</p>
                  </div>
                </div>
                <Button size="sm" className="w-full">Start SOAP Note</Button>
              </TabsContent>
              <TabsContent value="history">
                <div className="text-sm space-y-2">
                  <p>March 15, 2025 - Annual vaccines</p>
                  <p>Jan 22, 2025 - Dermatology consult</p>
                  <Button size="sm" variant="outline" className="w-full mt-2">View Full History</Button>
                </div>
              </TabsContent>
              <TabsContent value="meds">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Prednisolone</p>
                    <Badge>Active</Badge>
                  </div>
                  <Button size="sm" className="w-full">Prescribe Medication</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upcoming Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Max (Labrador)</p>
                    <p className="text-xs text-muted-foreground">John Smith</p>
                  </div>
                </div>
                <Badge variant="destructive">Waiting (15m)</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Charlie (Beagle)</p>
                    <p className="text-xs text-muted-foreground">Michael Brown</p>
                  </div>
                </div>
                <Badge variant="outline">10:30 AM</Badge>
              </div>
              
              <Button size="sm" variant="outline" className="w-full">View All</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ReceptionistContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Max - Check-up</p>
                  <p className="text-xs text-muted-foreground">09:30 - Exam 1</p>
                </div>
                <Badge variant="destructive">Waiting (15m)</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Bella - Vaccination</p>
                  <p className="text-xs text-muted-foreground">10:15 - Exam 2</p>
                </div>
                <Badge>In Progress</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Charlie - Dental</p>
                  <p className="text-xs text-muted-foreground">11:00 - Dental</p>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>
              
              <Button size="sm" className="w-full">New Appointment</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Check-In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <p className="text-sm font-medium">Charlie</p>
                  <p className="text-xs text-muted-foreground">Michael Brown</p>
                </div>
                <Button size="sm">Check In</Button>
              </div>
              
              <Button size="sm" variant="outline" className="w-full">Register New Client</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const NurseContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Treatment Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-2 border rounded-md bg-red-50 dark:bg-red-950/20">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Administer antibiotics to Max - URGENT
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Doxycycline 100mg - Every 12 hours
                </p>
                <Button size="sm" className="w-full mt-2">Start Task</Button>
              </div>
              
              <div className="p-2 border rounded-md">
                <p className="text-sm font-medium">
                  Prepare surgery room for Luna
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Surgery scheduled at 13:30
                </p>
                <Button size="sm" variant="outline" className="w-full mt-2">Start Task</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-2 border rounded-md">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Bella (Post-vaccination)</p>
                  <Badge>In Progress</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Monitor for 30 minutes after vaccine administration
                </p>
                <div className="mt-2 flex justify-between">
                  <span className="text-xs text-muted-foreground">15 minutes remaining</span>
                  <span className="text-xs text-muted-foreground">Dr. Johnson</span>
                </div>
              </div>
              
              <Button size="sm" variant="outline" className="w-full">View All Monitoring Tasks</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ManagerContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Today's Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-2 border rounded-md">
                <p className="text-xs text-muted-foreground">Appointments</p>
                <p className="text-xl font-semibold">12/18</p>
                <p className="text-xs text-muted-foreground">67% Complete</p>
              </div>
              <div className="p-2 border rounded-md">
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-xl font-semibold">$2,450</p>
                <p className="text-xs text-green-500">+15% vs. avg</p>
              </div>
              <div className="p-2 border rounded-md">
                <p className="text-xs text-muted-foreground">Occupancy Rate</p>
                <p className="text-xl font-semibold">78%</p>
              </div>
              <div className="p-2 border rounded-md">
                <p className="text-xs text-muted-foreground">Avg Visit Time</p>
                <p className="text-xl font-semibold">22 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Staff Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Dr. Smith</p>
                  <p className="text-sm text-muted-foreground">85%</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Dr. Johnson</p>
                  <p className="text-sm text-muted-foreground">92%</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Dr. Williams</p>
                  <p className="text-sm text-muted-foreground">76%</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
              
              <Button size="sm" variant="outline" className="w-full">View Full Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Main role-based interface component
const RoleBasedInterface: React.FC = () => {
  return (
    <RoleProvider>
      <div className="space-y-4">
        <RoleSelector />
        <RoleContent />
      </div>
    </RoleProvider>
  );
};

export default RoleBasedInterface;