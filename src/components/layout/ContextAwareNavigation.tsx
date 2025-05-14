import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Menu, X, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/context/AuthContext";
import { useRole } from "@/lib/context/RoleContext";
import { fadeAnimation } from "@/lib/motion";
import { FeatureGated } from "@/components/context/AdaptiveContainer";

interface ContextAwareNavigationProps {
  className?: string;
}

export function ContextAwareNavigation({
  className,
}: ContextAwareNavigationProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { roleConfig, userNavItems, quickActions } = useRole();
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
                <div className="rounded-full bg-teal-500 p-1.5 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                    <path d="M12 7c-1.95 0-2.92 1.5-2.92 3.5 0 2 .97 3.5 2.92 3.5 1.95 0 2.92-1.5 2.92-3.5 0-2-.97-3.5-2.92-3.5z" />
                    <path d="M10 14.5c-1.666 0-2.5 1.333-2.5 4 0 2.667.833 4 2.5 4 1.666 0 2.5-1.333 2.5-4 0-2.667-.834-4-2.5-4z" />
                    <path d="M14 14.5c1.666 0 2.5 1.333 2.5 4 0 2.667-.834 4-2.5 4-1.667 0-2.5-1.333-2.5-4 0-2.667.833-4 2.5-4z" />
                    <path d="M9.5 10.5c-1 0-1.5.5-1.5 1.5s.5 1.5 1.5 1.5 1.5-.5 1.5-1.5-.5-1.5-1.5-1.5z" />
                    <path d="M14.5 10.5c1 0 1.5.5 1.5 1.5s-.5 1.5-1.5 1.5-1.5-.5-1.5-1.5.5-1.5 1.5-1.5z" />
                  </svg>
                </div>
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
                  {userNavItems.map((item) => {
                    // Check if the current path matches this item
                    const isActive =
                      item.href === "/"
                        ? location.pathname === "/"
                        : location.pathname.includes(item.href);

                    return (
                      <Link
                        key={item.title}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg p-3 transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full",
                            item.color
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-medium">Snel Acties</h2>
                <div className="grid gap-2">
                  {quickActions.map((action) =>
                    action.onClick ? (
                      <Button
                        key={action.title}
                        onClick={action.onClick}
                        variant="ghost"
                        className="flex w-full items-center justify-start gap-3 p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full",
                            action.color
                          )}
                        >
                          <action.icon className="h-5 w-5" />
                        </div>
                        <span>{action.title}</span>
                      </Button>
                    ) : (
                      <Link
                        key={action.title}
                        to={action.href}
                        className="flex items-center gap-3 rounded-lg p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full",
                            action.color
                          )}
                        >
                          <action.icon className="h-5 w-5" />
                        </div>
                        <span>{action.title}</span>
                      </Link>
                    )
                  )}
                </div>
              </div>

              <FeatureGated feature="showAdvancedClinical">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                  <h3 className="mb-2 font-medium text-amber-800 dark:text-amber-300">
                    Klinische Modus Actief
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    U heeft toegang tot geavanceerde klinische functies op basis
                    van uw rol als {roleConfig.displayName}.
                  </p>
                </div>
              </FeatureGated>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
