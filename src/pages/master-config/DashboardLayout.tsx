import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, Save, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockFloors, mockZones } from "@/data/mockSystem";
import { DashboardLayout as DashboardLayoutType } from "@/types/system";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const WIDGET_TYPES = [
  { id: "sensor", label: "Sensor Card", icon: "📊" },
  { id: "chart", label: "Chart Card", icon: "📈" },
  { id: "alert", label: "Alert Widget", icon: "⚠️" },
  { id: "map", label: "Map Widget", icon: "🗺️" },
];

const DEFAULT_USER = "user1";

export default function DashboardLayoutConfig() {
  const [selectedFloor, setSelectedFloor] = useState<string>("floor-1");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [layouts, setLayouts] = useState<DashboardLayoutType[]>([]);
  const [currentLayout, setCurrentLayout] = useState<DashboardLayoutType | null>(null);
  const { toast } = useToast();

  // Load layouts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`dashboard-layouts-${DEFAULT_USER}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setLayouts(data);
      } catch (error) {
        console.error("Failed to load layouts:", error);
      }
    }
  }, []);

  // Load current layout based on floor and zone
  useEffect(() => {
    const layoutKey = selectedZone === "all" ? `${selectedFloor}` : `${selectedFloor}-${selectedZone}`;
    const existing = layouts.find(
      (l) => l.floorId === selectedFloor && l.zoneId === selectedZone
    );

    if (existing) {
      setCurrentLayout(existing);
    } else {
      // Create default layout
      const defaultLayout: DashboardLayoutType = {
        floorId: selectedFloor,
        zoneId: selectedZone,
        layout: [
          { i: "widget-1", x: 0, y: 0, w: 4, h: 2 },
          { i: "widget-2", x: 4, y: 0, w: 4, h: 2 },
          { i: "widget-3", x: 8, y: 0, w: 4, h: 2 },
        ],
        widgets: [
          { id: "widget-1", type: "sensor", config: { title: "Temperature" } },
          { id: "widget-2", type: "sensor", config: { title: "Humidity" } },
          { id: "widget-3", type: "chart", config: { title: "Trends" } },
        ],
      };
      setCurrentLayout(defaultLayout);
    }
  }, [selectedFloor, selectedZone, layouts]);

  const saveLayout = () => {
    if (!currentLayout) return;

    const updatedLayouts = layouts.filter(
      (l) => !(l.floorId === currentLayout.floorId && l.zoneId === currentLayout.zoneId)
    );
    updatedLayouts.push(currentLayout);
    setLayouts(updatedLayouts);
    localStorage.setItem(`dashboard-layouts-${DEFAULT_USER}`, JSON.stringify(updatedLayouts));
    toast({
      title: "Layout Saved",
      description: "Dashboard layout has been saved successfully.",
    });
  };

  const resetToDefaults = () => {
    if (window.confirm("Reset layout for this floor/zone?")) {
      const defaultLayout: DashboardLayoutType = {
        floorId: selectedFloor,
        zoneId: selectedZone,
        layout: [
          { i: "widget-1", x: 0, y: 0, w: 4, h: 2 },
          { i: "widget-2", x: 4, y: 0, w: 4, h: 2 },
        ],
        widgets: [
          { id: "widget-1", type: "sensor", config: { title: "Sensor 1" } },
          { id: "widget-2", type: "chart", config: { title: "Chart 1" } },
        ],
      };
      setCurrentLayout(defaultLayout);
      toast({
        title: "Reset to Defaults",
        description: "Layout has been reset.",
      });
    }
  };

  const addWidget = (type: string) => {
    if (!currentLayout) return;

    const newId = `widget-${Date.now()}`;
    const newWidget = {
      id: newId,
      type: type as any,
      config: { title: `New ${type}` },
    };
    const newLayoutItem = {
      i: newId,
      x: 0,
      y: Infinity, // Place at bottom
      w: 4,
      h: 2,
    };

    setCurrentLayout({
      ...currentLayout,
      widgets: [...currentLayout.widgets, newWidget],
      layout: [...currentLayout.layout, newLayoutItem],
    });
    toast({ title: "Widget Added" });
  };

  const removeWidget = (id: string) => {
    if (!currentLayout) return;
    setCurrentLayout({
      ...currentLayout,
      widgets: currentLayout.widgets.filter((w) => w.id !== id),
      layout: currentLayout.layout.filter((l) => l.i !== id),
    });
    toast({ title: "Widget Removed" });
  };

  const onLayoutChange = (newLayout: Layout[]) => {
    if (!currentLayout) return;
    setCurrentLayout({
      ...currentLayout,
      layout: newLayout.map((item) => ({
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      })),
    });
  };

  const floorZones = mockZones.filter((z) => z.floorId === selectedFloor);

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Layout Configuration</h2>
            <p className="text-muted-foreground">
              Customize widget positions for each floor and zone
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button onClick={saveLayout}>
              <Save className="mr-2 h-4 w-4" />
              Save Layout
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <Label>Floor</Label>
            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockFloors.map((floor) => (
                  <SelectItem key={floor.id} value={floor.id}>
                    {floor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Zone</Label>
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {floorZones.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id}>
                    {zone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 items-end">
            {WIDGET_TYPES.map((type) => (
              <Button
                key={type.id}
                variant="outline"
                size="sm"
                onClick={() => addWidget(type.id)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {type.icon} {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid Layout Preview */}
        <Card className="p-4 bg-muted/20">
          <h3 className="text-lg font-semibold mb-4">Layout Preview</h3>
          <div className="bg-background rounded-lg p-4 min-h-[500px]">
            {currentLayout && (
              <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: currentLayout.layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={100}
                onLayoutChange={onLayoutChange}
                isDraggable
                isResizable
                draggableHandle=".drag-handle"
              >
                {currentLayout.widgets.map((widget) => (
                  <div key={widget.id} className="bg-card border rounded-lg shadow-sm">
                    <div className="h-full flex flex-col">
                      <div className="drag-handle cursor-move p-3 border-b flex items-center justify-between bg-muted/50">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {WIDGET_TYPES.find((t) => t.id === widget.type)?.icon}
                          </span>
                          <span className="font-medium">{widget.config.title}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWidget(widget.id)}
                        >
                          ✕
                        </Button>
                      </div>
                      <div className="flex-1 p-4 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <div className="text-3xl mb-2">
                            {WIDGET_TYPES.find((t) => t.id === widget.type)?.icon}
                          </div>
                          <p className="text-sm">{widget.type} widget</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ResponsiveGridLayout>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Drag widgets by their header to reposition, and resize by dragging corners.
          </p>
        </Card>
      </Card>
    </div>
  );
}
