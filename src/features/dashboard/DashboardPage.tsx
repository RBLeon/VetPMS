import React, { useEffect, useState } from "react";
import { useUi } from "../../lib/context/UiContext";
import { useTenant } from "../../lib/context/TenantContext";
import { useAuth } from "../../lib/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { CalendarIcon, ClipboardCheckIcon, PawPrintIcon, UsersIcon, LineChartIcon, ActivityIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";

// Dashboard page component
const DashboardPage = () => {
  const { setCurrentWorkspace } = useUi();
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [todayStats, setTodayStats] = useState({
    appointments: 0,
    completed: 0,
    waiting: 0,
    lateCheckIn: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set dashboard as current workspace and fetch data
  useEffect(() => {
    setCurrentWorkspace("dashboard");
    fetchDashboardData();
  }, [setCurrentWorkspace, currentTenant?.id]);

  // Fetch dashboard data - mock implementation
  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    try {
      // This would be an API call in a real implementation
      setTimeout(() => {
        // Mock data
        setTodayStats({
          appointments: 24,
          completed: 9,
          waiting: 3,
          lateCheckIn: 2
        });
        
        setRecentActivity([
          { 
            id: 1, 
            type: "appointment",
            title: "Consultation completed", 
            patient: "Max", 
            client: "John Smith",
            time: "10:30 AM",
            status: "completed"
          },
          { 
            id: 2, 
            type: "checkin",
            title: "Patient checked in", 
            patient: "Bella", 
            client: "Emma Johnson",
            time: "09:45 AM",
            status: "active"
          },
          { 
            id: 3, 
            type: "note",
            title: "Follow-up reminder set", 
            patient: "Charlie", 
            client: "Michael Brown",
            time: "Yesterday",
            status: "pending"
          },
          { 
            id: 4, 
            type: "prescription",
            title: "Prescription issued", 
            patient: "Luna", 
            client: "Sophia Davis",
            time: "Yesterday",
            status: "completed"
          },
          { 
            id: 5, 
            type: "result",
            title: "Lab results received", 
            patient: "Cooper", 
            client: "Robert Wilson",
            time: "2 days ago",
            status: "attention"
          }
        ]);
        
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setIsLoading(false);
    }
  };

  // Event icon based on activity type
  const getActivityIcon = (type, status) => {
    switch (type) {
      case "appointment":
        return <CalendarIcon className="h-5 w-5 text-primary" />;
      case "checkin":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "note":
        return <ClipboardCheckIcon className="h-5 w-5 text-amber-500" />;
      case "prescription":
        return <ClipboardCheckIcon className="h-5 w-5 text-blue-500" />;
      case "result":
        return status === "attention" 
          ? <AlertCircleIcon className="h-5 w-5 text-red-500" />
          : <LineChartIcon className="h-5 w-5 text-slate-500" />;
      default:
        return <ActivityIcon className="h-5 w-5 text-slate-500" />;
    }
  };

  // Quick action buttons for common tasks
  const quickActions = [
    { 
      id: "new-appointment", 
      label: "New Appointment",
      icon: <CalendarIcon className="h-5 w-5 mr-2" />,
      action: () => console.log("New appointment")
    },
    { 
      id: "new-patient", 
      label: "Register Patient",
      icon: <PawPrintIcon className="h-5 w-5 mr-2" />,
      action: () => console.log("Register patient")
    },
    { 
      id: "new-client", 
      label: "Add Client",
      icon: <UsersIcon className="h-5 w-5 mr-2" />,
      action: () => console.log("Add client")
    },
    { 
      id: "view-reports", 
      label: "Reports",
      icon: <LineChartIcon className="h-5 w-5 mr-2" />,
      action: () => console.log("View reports")
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header with tenant info */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.firstName}!</h1>
        <p className="text-muted-foreground">
          {currentTenant?.name} • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Quick action buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Button 
            key={action.id}
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={action.action}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Activity timeline panel */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>Recent activity across the practice</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array(5).fill(null).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 py-3">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-1/2 bg-muted animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {recentActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-start space-x-4 py-3 border-t first:border-0 border-border"
                  >
                    <div className="mt-1">
                      {getActivityIcon(activity.type, activity.status)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.patient} • {activity.client}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's statistics panel */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Overview</CardTitle>
            <CardDescription>Key metrics for today</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(4).fill(null).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
                    <div className="h-8 w-3/4 bg-muted animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
                  <p className="text-3xl font-bold">{todayStats.appointments}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-semibold text-green-600">{todayStats.completed}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Waiting</p>
                    <p className="text-2xl font-semibold text-amber-500">{todayStats.waiting}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Late Check-ins</p>
                    <p className="text-2xl font-semibold text-red-500">{todayStats.lateCheckIn}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Tabs defaultValue="upcoming">
                    <TabsList className="w-full">
                      <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
                      <TabsTrigger value="today" className="flex-1">Today's</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upcoming" className="space-y-2 mt-2">
                      <div className="flex justify-between text-sm p-2 border-b">
                        <span>Bella</span>
                        <span className="text-muted-foreground">11:30 AM</span>
                      </div>
                      <div className="flex justify-between text-sm p-2 border-b">
                        <span>Cooper</span>
                        <span className="text-muted-foreground">12:15 PM</span>
                      </div>
                      <div className="flex justify-between text-sm p-2">
                        <span>Daisy</span>
                        <span className="text-muted-foreground">2:00 PM</span>
                      </div>
                    </TabsContent>
                    <TabsContent value="today" className="space-y-2 mt-2">
                      <div className="flex justify-between text-sm p-2 border-b">
                        <span>Max</span>
                        <span className="text-green-600">Completed</span>
                      </div>
                      <div className="flex justify-between text-sm p-2 border-b">
                        <span>Lily</span>
                        <span className="text-green-600">Completed</span>
                      </div>
                      <div className="flex justify-between text-sm p-2">
                        <span>Rocky</span>
                        <span className="text-amber-500">Waiting</span>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;