# VetPMS Full UI Component Library

This document provides comprehensive specifications for the complete VetPMS UI Component Library, including all advanced features beyond the MVP.

## Technology Stack

- **React 18+** with TypeScript 5.0+
- **Tailwind CSS** with custom design system
- **Shadcn/ui** as base component library
- **Framer Motion** for animations
- **React Spring** for physics-based animations
- **Redux Toolkit** for state management
- **React Query** for server state
- **Radix UI** for accessible primitives
- **D3.js** for data visualization
- **Recharts** for business charts
- **React Big Calendar** for scheduling
- **Storybook** for component documentation

## Architecture

### Component Structure

```
src/
  components/
    atoms/              # Basic UI elements
    molecules/          # Composite components
    organisms/          # Complex UI sections
    templates/          # Page layouts
    
  features/
    context-ui/         # Context-aware components
    ai-assist/          # AI-powered interfaces
    multi-tenant/       # Multi-tenant specific
    integrations/       # Integration components
    
  hooks/
    useContextAware/    # Context adaptation hooks
    useAI/              # AI feature hooks
    useRealtime/        # Real-time data hooks
    
  providers/
    ThemeProvider/      # Theme management
    ContextProvider/    # UI context management
    AIProvider/         # AI service integration
```

## Context-Aware UI System

### ContextProvider

Advanced context management for role-based UI adaptation.

```typescript
interface UIContext {
  user: User;
  role: Role;
  tenant: Tenant;
  currentContext: WorkContext;
  preferences: UserPreferences;
  deviceContext: DeviceContext;
}

export const ContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [context, setContext] = useState<UIContext>();
  const [uiConfig, setUIConfig] = useState<UIConfiguration>();
  
  useEffect(() => {
    // Load and adapt UI based on context
    const loadUIConfiguration = async () => {
      const config = await uiAdaptationService.getConfiguration(context);
      setUIConfig(config);
    };
    
    loadUIConfiguration();
  }, [context]);
  
  return (
    <UIContextProvider value={{ context, uiConfig, setContext }}>
      {children}
    </UIContextProvider>
  );
};
```

### AdaptiveContainer

Container that dynamically renders components based on context.

```typescript
interface AdaptiveContainerProps {
  componentKey: string;
  fallback?: React.ReactNode;
}

export const AdaptiveContainer: React.FC<AdaptiveContainerProps> = ({
  componentKey,
  fallback
}) => {
  const { uiConfig, context } = useUIContext();
  const Component = uiConfig?.components[componentKey];
  
  if (!Component) return fallback || null;
  
  return (
    <ErrorBoundary>
      <Component context={context} />
    </ErrorBoundary>
  );
};
```

### RoleBasedComponent

Component that renders different variants based on user role.

```typescript
interface RoleBasedComponentProps {
  variants: {
    [role: string]: React.ComponentType<any>;
  };
  defaultVariant?: React.ComponentType<any>;
}

export const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({
  variants,
  defaultVariant: Default
}) => {
  const { role } = useUserContext();
  const Component = variants[role] || Default;
  
  if (!Component) return null;
  
  return <Component />;
};
```

## AI-Powered Components

### AIAssistant

Intelligent assistant interface for various AI features.

```typescript
interface AIAssistantProps {
  context: 'documentation' | 'diagnosis' | 'scheduling';
  onSuggestion?: (suggestion: AISuggestion) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  context,
  onSuggestion
}) => {
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const { getAISuggestions } = useAI();
  
  const handleVoiceInput = async (transcript: string) => {
    const results = await getAISuggestions(context, transcript);
    setSuggestions(results);
  };
  
  return (
    <div className="ai-assistant">
      <VoiceInput
        isListening={isListening}
        onTranscript={handleVoiceInput}
      />
      <SuggestionList
        suggestions={suggestions}
        onSelect={onSuggestion}
      />
    </div>
  );
};
```

### SmartSOAPEditor

AI-enhanced SOAP note editor with real-time suggestions.

```typescript
export const SmartSOAPEditor: React.FC<SmartSOAPEditorProps> = ({
  patientId,
  onSave
}) => {
  const [soapData, setSOAPData] = useState<SOAPNote>();
  const { generateSOAP, getSuggestions } = useAI();
  
  const handleVoiceInput = async (section: keyof SOAPNote, transcript: string) => {
    const enhanced = await getSuggestions('soap', transcript, { section });
    setSOAPData(prev => ({
      ...prev,
      [section]: enhanced.content
    }));
  };
  
  return (
    <div className="smart-soap-editor">
      {(['subjective', 'objective', 'assessment', 'plan'] as const).map(section => (
        <SOAPSection
          key={section}
          section={section}
          value={soapData?.[section]}
          onVoiceInput={(transcript) => handleVoiceInput(section, transcript)}
          suggestions={soapData?.suggestions?.[section]}
        />
      ))}
      <DiagnosisSuggestions
        symptoms={soapData?.subjective}
        findings={soapData?.objective}
      />
    </div>
  );
};
```

## Advanced Scheduling Components

### IntelligentScheduler

Smart scheduling system with resource optimization.

```typescript
export const IntelligentScheduler: React.FC<SchedulerProps> = ({
  date,
  resources,
  onAppointmentCreate
}) => {
  const { optimizeSchedule, findBestSlot } = useSchedulingAI();
  const [suggestions, setSuggestions] = useState<ScheduleSuggestion[]>();
  
  const handleDragEnd = async (result: DragResult) => {
    const optimized = await optimizeSchedule(result);
    if (optimized.hasConflicts) {
      setSuggestions(optimized.suggestions);
    } else {
      onAppointmentCreate(optimized.appointment);
    }
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ScheduleGrid
        date={date}
        resources={resources}
        renderTimeSlot={({ time, resource }) => (
          <TimeSlot
            availability={resource.getAvailability(time)}
            suggestions={suggestions?.filter(s => s.time === time)}
          />
        )}
      />
      <ResourceOptimizer
        resources={resources}
        onOptimize={handleOptimize}
      />
    </DragDropContext>
  );
};
```

### ResourceAllocationView

Visual resource management component.

```typescript
export const ResourceAllocationView: React.FC = () => {
  const { resources, allocations } = useResources();
  
  return (
    <div className="resource-allocation">
      <ResourceTimeline
        resources={resources}
        allocations={allocations}
        renderResource={(resource) => (
          <ResourceCard
            resource={resource}
            utilization={resource.getUtilization()}
            conflicts={resource.getConflicts()}
          />
        )}
      />
      <AllocationHeatmap
        data={allocations}
        onCellClick={handleCellClick}
      />
    </div>
  );
};
```

## Multi-Tenant Components

### TenantSelector

Dynamic tenant switching interface.

```typescript
export const TenantSelector: React.FC = () => {
  const { tenants, currentTenant, switchTenant } = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Building className="mr-2 h-4 w-4" />
          {currentTenant.name}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <TenantList
          tenants={tenants}
          currentTenant={currentTenant}
          onSelect={(tenant) => {
            switchTenant(tenant.id);
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
```

### CrossTenantDashboard

Dashboard for franchise/multi-practice overview.

```typescript
export const CrossTenantDashboard: React.FC = () => {
  const { tenants, metrics } = useFranchiseData();
  
  return (
    <div className="cross-tenant-dashboard">
      <MetricsOverview
        data={metrics}
        groupBy="tenant"
        renderMetric={(metric) => (
          <MetricCard
            title={metric.name}
            value={metric.value}
            trend={metric.trend}
            comparison={metric.comparison}
          />
        )}
      </div>
      <PerformanceComparison
        tenants={tenants}
        metrics={['revenue', 'appointments', 'satisfaction']}
      />
      <TenantMap
        locations={tenants.map(t => t.location)}
        metrics={metrics}
      />
    </div>
  );
};
```

## Real-time Collaboration Components

### CollaborativeEditor

Real-time document collaboration component.

```typescript
export const CollaborativeEditor: React.FC<EditorProps> = ({
  documentId,
  onSave
}) => {
  const { content, collaborators, updates } = useCollaboration(documentId);
  const [localContent, setLocalContent] = useState(content);
  
  useEffect(() => {
    const unsubscribe = updates.subscribe((update) => {
      setLocalContent(prev => applyUpdate(prev, update));
    });
    
    return () => unsubscribe();
  }, [updates]);
  
  return (
    <div className="collaborative-editor">
      <CollaboratorAvatars users={collaborators} />
      <Editor
        content={localContent}
        onChange={handleChange}
        renderCursor={({ user, position }) => (
          <CollaboratorCursor user={user} position={position} />
        )}
      />
      <PresenceIndicator collaborators={collaborators} />
    </div>
  );
};
```

### LiveActivityFeed

Real-time activity monitoring component.

```typescript
export const LiveActivityFeed: React.FC = () => {
  const { activities, subscribe } = useActivityStream();
  const [feed, setFeed] = useState<Activity[]>(activities);
  
  useEffect(() => {
    const unsubscribe = subscribe((activity) => {
      setFeed(prev => [activity, ...prev].slice(0, 50));
    });
    
    return () => unsubscribe();
  }, [subscribe]);
  
  return (
    <div className="live-activity-feed">
      <AnimatePresence>
        {feed.map(activity => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <ActivityCard activity={activity} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
```

## Advanced Data Visualization

### AnalyticsDashboard

Comprehensive analytics visualization component.

```typescript
export const AnalyticsDashboard: React.FC<DashboardProps> = ({
  dateRange,
  metrics
}) => {
  const { data, isLoading } = useAnalytics(dateRange, metrics);
  
  return (
    <div className="analytics-dashboard">
      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
        presets={['today', 'week', 'month', 'quarter', 'year']}
      />
      
      <MetricsGrid>
        {metrics.map(metric => (
          <MetricTile
            key={metric.id}
            metric={metric}
            data={data[metric.id]}
            renderChart={(chartData) => (
              <ResponsiveChart
                type={metric.chartType}
                data={chartData}
                options={metric.chartOptions}
              />
            )}
          />
        ))}
      </MetricsGrid>
      
      <TrendAnalysis
        data={data}
        onDrillDown={handleDrillDown}
      />
    </div>
  );
};
```

### InteractiveChart

Dynamic, interactive charting component.

```typescript
export const InteractiveChart: React.FC<ChartProps> = ({
  data,
  type,
  options
}) => {
  const [zoom, setZoom] = useState({ x: [0, 100], y: [0, 100] });
  const [tooltip, setTooltip] = useState<TooltipData>();
  
  return (
    <div className="interactive-chart">
      <ChartControls
        onZoom={setZoom}
        onExport={handleExport}
        onReset={handleReset}
      />
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {renderChartElements(type, data, options)}
          <Brush dataKey="date" height={30} stroke="#8884d8" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
```

## Integration Components

### IntegrationManager

Unified integration management interface.

```typescript
export const IntegrationManager: React.FC = () => {
  const { integrations, status } = useIntegrations();
  const [selectedIntegration, setSelectedIntegration] = useState<Integration>();
  
  return (
    <div className="integration-manager">
      <IntegrationList
        integrations={integrations}
        onSelect={setSelectedIntegration}
        renderIntegration={(integration) => (
          <IntegrationCard
            integration={integration}
            status={status[integration.id]}
            onConfigure={() => handleConfigure(integration)}
            onTest={() => handleTest(integration)}
          />
        )}
      />
      
      {selectedIntegration && (
        <IntegrationDetails
          integration={selectedIntegration}
          logs={getIntegrationLogs(selectedIntegration.id)}
          onSync={() => handleSync(selectedIntegration)}
        />
      )}
    </div>
  );
};
```

## Mobile-Optimized Components

### TouchOptimizedCalendar

Mobile-friendly calendar with gesture support.

```typescript
export const TouchOptimizedCalendar: React.FC = () => {
  const { events, view, setView } = useCalendar();
  const [gestureState, setGestureState] = useState<GestureState>();
  
  const bind = useGesture({
    onDrag: ({ movement: [mx, my], direction: [dx], velocity }) => {
      if (Math.abs(dx) > 0.5 && velocity > 0.2) {
        handleSwipe(dx > 0 ? 'next' : 'prev');
      }
    },
    onPinch: ({ offset: [scale] }) => {
      if (scale > 1.5) setView('day');
      if (scale < 0.7) setView('month');
    }
  });
  
  return (
    <div {...bind()} className="touch-calendar">
      <CalendarHeader
        view={view}
        onViewChange={setView}
        onNavigate={handleNavigate}
      />
      <AnimatedCalendarView
        view={view}
        events={events}
        gestureState={gestureState}
      />
    </div>
  );
};
```

## Accessibility Components

### AccessibleDataTable

Fully accessible data table with keyboard navigation.

```typescript
export const AccessibleDataTable: React.FC<TableProps> = ({
  data,
  columns,
  onRowClick
}) => {
  const [focusedCell, setFocusedCell] = useState({ row: 0, col: 0 });
  
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        moveFocus('up');
        break;
      case 'ArrowDown':
        moveFocus('down');
        break;
      case 'ArrowLeft':
        moveFocus('left');
        break;
      case 'ArrowRight':
        moveFocus('right');
        break;
      case 'Enter':
      case ' ':
        handleCellAction(focusedCell);
        break;
    }
  };
  
  return (
    <table
      role="grid"
      aria-rowcount={data.length}
      onKeyDown={handleKeyDown}
    >
      <thead>
        <tr role="row">
          {columns.map((column, index) => (
            <th
              key={column.key}
              role="columnheader"
              aria-sort={column.sortDirection}
              tabIndex={focusedCell.row === 0 && focusedCell.col === index ? 0 : -1}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={row.id}
            role="row"
            aria-rowindex={rowIndex + 1}
          >
            {columns.map((column, colIndex) => (
              <td
                key={`${row.id}-${column.key}`}
                role="gridcell"
                tabIndex={
                  focusedCell.row === rowIndex && focusedCell.col === colIndex
                    ? 0
                    : -1
                }
              >
                {renderCell(row, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

## Performance Optimization

### VirtualizedList

High-performance list rendering for large datasets.

```typescript
export const VirtualizedList: React.FC<VirtualizedListProps> = ({
  items,
  itemHeight,
  renderItem
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerRef.current.clientHeight / itemHeight);
    
    setVisibleRange({
      start: Math.max(0, start - 5),
      end: Math.min(items.length, start + visibleCount + 5)
    });
  }, [items.length, itemHeight]);
  
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: '100%', overflow: 'auto' }}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {items.slice(visibleRange.start, visibleRange.end).map((item, index) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: (visibleRange.start + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, visibleRange.start + index)}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Theme System

### Advanced Theme Configuration

```typescript
// theme.config.ts
export const theme = {
  colors: {
    primary: generateColorScale('#0055A4'),
    secondary: generateColorScale('#00A878'),
    // ... other colors
  },
  
  typography: {
    fontFamilies: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['DM Sans', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    
    fontSizes: generateTypeScale(1.25),
    
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  spacing: generateSpacingScale(4),
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  animations: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    
    easings: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },
};
```

### Dynamic Theme Provider

```typescript
export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  
  const value = useMemo(() => ({
    theme: generateThemeVariables(theme, mode),
    setTheme,
    mode,
    setMode,
  }), [theme, mode]);
  
  return (
    <ThemeContext.Provider value={value}>
      <style>{generateCSSVariables(value.theme)}</style>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Testing Utilities

### Component Test Helpers

```typescript
// test-utils.tsx
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: RenderOptions
) => {
  const AllProviders: React.FC<PropsWithChildren> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ContextProvider>
          {children}
        </ContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
  
  return render(ui, { wrapper: AllProviders, ...options });
};

// Custom assertions
expect.extend({
  toBeAccessible(received) {
    const results = axe.run(received);
    const pass = results.violations.length === 0;
    
    return {
      pass,
      message: () => 
        pass
          ? 'Component is accessible'
          : `Component has accessibility violations: ${formatViolations(results.violations)}`
    };
  }
});
```

## Documentation

### Storybook Integration

```typescript
// Button.stories.tsx
export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Primary UI button component with multiple variants and states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Primary Button',
  variant: 'primary',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: (
    <>
      <PlusIcon className="mr-2 h-4 w-4" />
      Add Item
    </>
  ),
};
```

## Component Development Guidelines

### Advanced Best Practices

1. **Performance First**
   - Use React.memo for expensive components
   - Implement virtualization for large lists
   - Optimize re-renders with proper dependency arrays
   - Use code splitting for large components

2. **Accessibility by Default**
   - Follow WCAG 2.1 AA standards
   - Implement keyboard navigation
   - Provide proper ARIA attributes
   - Test with screen readers

3. **Responsive Design**
   - Mobile-first approach
   - Touch-optimized interactions
   - Adaptive layouts for all screen sizes
   - Performance optimization for mobile devices

4. **Type Safety**
   - Strict TypeScript configuration
   - Proper generic types for reusable components
   - Runtime type checking for critical paths
   - Type inference optimization

5. **Testing Strategy**
   - Unit tests for logic
   - Integration tests for workflows
   - Visual regression tests
   - Performance benchmarks
   - Accessibility audits

6. **Documentation**
   - JSDoc comments for all public APIs
   - Storybook stories for all components
   - Usage examples and best practices
   - Migration guides for breaking changes

This comprehensive component library provides the foundation for building a world-class veterinary practice management system with advanced features, exceptional user experience, and enterprise-grade reliability.
