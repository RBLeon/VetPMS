import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Menu,
  X,
  PlusCircle,
  LogOut,
  Home,
  Users,
  Stethoscope,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  CheckSquare,
  CreditCard,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/context/AuthContext";
import { useRole } from "@/lib/context/RoleContext";
import { fadeAnimation } from "@/lib/motion";
import { useResource, useNavigation, useLogout } from "@refinedev/core";

interface RefineContextAwareNavigationProps {
  className?: string;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Home,
  Users,
  Stethoscope,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  CheckSquare,
  CreditCard,
  ChevronRight,
};

export function RefineContextAwareNavigation({
  className,
}: RefineContextAwareNavigationProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { role, roleConfig, quickActions } = useRole();
  const { resources } = useResource();
  const { list } = useNavigation();
  const { mutate: logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  // Close navigation when route changes
  useEffect(() => {
    setIsOpen(false);
    setShowQuickActions(false);
  }, [location.pathname]);

  // Handle click outside for quick actions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        quickActionsRef.current &&
        !quickActionsRef.current.contains(event.target as Node)
      ) {
        setShowQuickActions(false);
      }
    };

    if (showQuickActions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showQuickActions]);

  // Filter resources based on user role
  const accessibleResources = resources.filter((resource) => {
    const canAccess = resource.meta?.canAccess as string[] | undefined;
    return !canAccess || (role && canAccess.includes(role));
  });

  // Handle navigation to resource
  const handleResourceClick = (resourceName: string) => {
    list(resourceName);
    setIsOpen(false);
  };

  // Get icon component from string name
  const getIconComponent = (iconName: string): LucideIcon => {
    return iconMap[iconName] || ChevronRight;
  };

  return (
    <>
      {/* Main Navigation Button */}
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <AnimatePresence>
          {!isOpen && !showQuickActions && (
            <motion.div
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={fadeAnimation}
            >
              <Button
                size="lg"
                className="h-14 w-14 rounded-full shadow-lg"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions Button */}
        <AnimatePresence>
          {!isOpen && !showQuickActions && (
            <motion.div
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={fadeAnimation}
              className="absolute bottom-20 right-0"
            >
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-14 rounded-full bg-white shadow-lg dark:bg-slate-900"
                onClick={() => setShowQuickActions(true)}
              >
                <PlusCircle className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions Menu */}
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              ref={quickActionsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-20 right-0 flex flex-col gap-3"
            >
              <Button
                size="icon"
                variant="ghost"
                className="ml-auto h-10 w-10 rounded-full"
                onClick={() => setShowQuickActions(false)}
                aria-label="Snel acties sluiten"
              >
                <X className="h-5 w-5" />
              </Button>

              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {action.onClick ? (
                    <Button
                      variant="outline"
                      className="flex h-auto w-auto items-center gap-2 rounded-full bg-white px-4 py-3 shadow-md dark:bg-slate-900"
                      onClick={action.onClick}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          action.color
                        )}
                      >
                        <action.icon className="h-4 w-4" />
                      </div>
                      <span>{action.title}</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex h-auto w-auto items-center gap-2 rounded-full bg-white px-4 py-3 shadow-md dark:bg-slate-900"
                      asChild
                    >
                      <Link to={action.href}>
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full",
                            action.color
                          )}
                        >
                          <action.icon className="h-4 w-4" />
                        </div>
                        <span>{action.title}</span>
                      </Link>
                    </Button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm dark:bg-black/50"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-md overflow-auto rounded-l-2xl bg-white p-6 shadow-xl dark:bg-slate-900 md:max-w-sm"
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight">VetPMS</h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mb-6 flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt={user?.firstName} />
                <AvatarFallback>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {roleConfig.displayName}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-medium">Navigatie</h2>
                <nav className="grid gap-2">
                  {accessibleResources.map((resource) => {
                    // Check if the current path matches this resource
                    const isActive = location.pathname.includes(
                      resource.route?.toString() || ""
                    );

                    // Get icon from meta
                    const iconName =
                      (resource.meta?.icon as string) || "ChevronRight";
                    const IconComponent = getIconComponent(iconName);
                    const color =
                      (resource.meta?.color as string) ||
                      "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300";

                    return (
                      <Button
                        key={resource.name}
                        variant="ghost"
                        className={cn(
                          "flex w-full items-center justify-start gap-3 rounded-lg p-3 transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => handleResourceClick(resource.name)}
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full",
                            color
                          )}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span>{resource.meta?.label || resource.name}</span>
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </Button>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-2">
                <div className="grid gap-2">
                  <Button
                    onClick={() => logout()}
                    variant="ghost"
                    className="flex w-full items-center justify-start gap-3 p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                      )}
                    >
                      <LogOut className="h-5 w-5" />
                    </div>
                    <span>Uitloggen</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
