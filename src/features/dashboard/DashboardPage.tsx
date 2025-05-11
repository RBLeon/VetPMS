import { useEffect, useState } from "react";
import { useUi } from "../../lib/context/UiContext";
import { useTenant } from "../../lib/context/TenantContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { CalendarIcon, CheckCircleIcon, LineChartIcon } from "lucide-react";

interface Activity {
  id: number;
  type: string;
  title: string;
  patient: string;
  client: string;
  time: string;
  status: "voltooid" | "actief" | "in_afwachting" | "aandacht";
}

// Dashboard page component
const DashboardPage = () => {
  const { setCurrentWorkspace } = useUi();
  const { currentTenant } = useTenant();
  const [todayStats, setTodayStats] = useState({
    appointments: 0,
    completed: 0,
    waiting: 0,
    lateCheckIn: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
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
        setTodayStats({
          appointments: 24,
          completed: 9,
          waiting: 3,
          lateCheckIn: 2,
        });

        setActivities([
          {
            id: 1,
            type: "appointment",
            title: "Consult afgerond",
            patient: "Max",
            client: "Jan Jansen",
            time: "10:30",
            status: "voltooid",
          },
          {
            id: 2,
            type: "checkin",
            title: "Patiënt aangemeld",
            patient: "Bella",
            client: "Emma Jansen",
            time: "09:45",
            status: "actief",
          },
        ]);

        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Fout bij het ophalen van dashboard gegevens:", error);
      setIsLoading(false);
    }
  };

  // Event icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <CalendarIcon className="h-5 w-5 text-primary" />;
      case "checkin":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <LineChartIcon className="h-5 w-5 text-slate-500" />;
    }
  };

  if (isLoading) {
    return <div>Laden...</div>;
  }

  return (
    <div className="space-y-4 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Overzicht van Vandaag</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-4">
              <CalendarIcon className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium">Afspraken</p>
                <p className="text-2xl font-bold">{todayStats.appointments}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm font-medium">Voltooid</p>
                <p className="text-2xl font-bold">{todayStats.completed}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recente Activiteit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 rounded-lg border p-4"
              >
                {getActivityIcon(activity.type)}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">
                    {activity.patient} - {activity.client}
                  </p>
                </div>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
