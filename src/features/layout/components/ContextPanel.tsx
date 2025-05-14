import React from "react";
import { ContextualAction } from "@/lib/context/UiContext";
import { Button } from "@/features/ui/components/button";
import { ScrollArea } from "@/features/ui/components/scroll-area";
import { PanelRightOpenIcon } from "lucide-react";

interface ContextPanelProps {
  actions: ContextualAction[];
}

const ContextPanel: React.FC<ContextPanelProps> = ({ actions }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div
      className={`border-l border-border transition-all duration-300 ${
        isExpanded ? "w-64" : "w-12"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="p-2 flex justify-between items-center border-b border-border">
          {isExpanded && <h3 className="text-sm font-medium">Acties</h3>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className={isExpanded ? "" : "mx-auto"}
          >
            <PanelRightOpenIcon
              className={`h-4 w-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {isExpanded && (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {actions.length > 0 ? (
                actions.map((action) => (
                  <Button
                    key={action.id}
                    onClick={action.action}
                    disabled={action.disabled}
                    variant={action.variant || "default"}
                    className="w-full justify-start"
                  >
                    {action.label}
                  </Button>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center p-4">
                  Geen acties beschikbaar voor huidige context
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {!isExpanded && actions.length > 0 && (
          <div className="flex flex-col items-center p-2 space-y-4">
            {actions.slice(0, 4).map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                size="icon"
                onClick={action.action}
                disabled={action.disabled}
                title={action.label}
              >
                <div className="w-4 h-4 rounded-full bg-primary" />
              </Button>
            ))}
            {actions.length > 4 && (
              <div className="text-xs text-muted-foreground">
                +{actions.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextPanel;
