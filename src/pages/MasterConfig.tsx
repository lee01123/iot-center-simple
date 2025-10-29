import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Settings, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardConfig {
  widgets: {
    temperature: boolean;
    humidity: boolean;
    light: boolean;
    power: boolean;
    charts: boolean;
  };
  zones: {
    zoneA: boolean;
    zoneB: boolean;
  };
  refreshRate: number;
  notifications: boolean;
}

export default function MasterConfig() {
  const { toast } = useToast();
  const [config, setConfig] = useState<DashboardConfig>({
    widgets: {
      temperature: true,
      humidity: true,
      light: true,
      power: true,
      charts: true,
    },
    zones: {
      zoneA: true,
      zoneB: true,
    },
    refreshRate: 3,
    notifications: true,
  });

  const handleSave = () => {
    localStorage.setItem("dashboardConfig", JSON.stringify(config));
    toast({
      title: "Configuration Saved",
      description: "Dashboard settings have been updated",
    });
  };

  const handleReset = () => {
    const defaultConfig: DashboardConfig = {
      widgets: {
        temperature: true,
        humidity: true,
        light: true,
        power: true,
        charts: true,
      },
      zones: {
        zoneA: true,
        zoneB: true,
      },
      refreshRate: 3,
      notifications: true,
    };
    setConfig(defaultConfig);
    toast({
      title: "Configuration Reset",
      description: "Settings restored to defaults",
    });
  };

  const updateWidget = (widget: keyof DashboardConfig["widgets"], value: boolean) => {
    setConfig((prev) => ({
      ...prev,
      widgets: { ...prev.widgets, [widget]: value },
    }));
  };

  const updateZone = (zone: keyof DashboardConfig["zones"], value: boolean) => {
    setConfig((prev) => ({
      ...prev,
      zones: { ...prev.zones, [zone]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Master Configuration</h2>
        <p className="text-muted-foreground">Customize dashboard display and behavior</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Widget Display
            </CardTitle>
            <CardDescription>Choose which widgets to show on dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="temp-widget" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-medium">Temperature Sensor</span>
                  <span className="text-sm text-muted-foreground">
                    Display temperature readings
                  </span>
                </Label>
                <Switch
                  id="temp-widget"
                  checked={config.widgets.temperature}
                  onCheckedChange={(checked) => updateWidget("temperature", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="humidity-widget" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-medium">Humidity Sensor</span>
                  <span className="text-sm text-muted-foreground">
                    Display humidity readings
                  </span>
                </Label>
                <Switch
                  id="humidity-widget"
                  checked={config.widgets.humidity}
                  onCheckedChange={(checked) => updateWidget("humidity", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="light-widget" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-medium">Light Intensity</span>
                  <span className="text-sm text-muted-foreground">
                    Display light sensor data
                  </span>
                </Label>
                <Switch
                  id="light-widget"
                  checked={config.widgets.light}
                  onCheckedChange={(checked) => updateWidget("light", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="power-widget" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-medium">Power Usage</span>
                  <span className="text-sm text-muted-foreground">
                    Display power consumption
                  </span>
                </Label>
                <Switch
                  id="power-widget"
                  checked={config.widgets.power}
                  onCheckedChange={(checked) => updateWidget("power", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="charts-widget" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-medium">History Charts</span>
                  <span className="text-sm text-muted-foreground">
                    Display historical data charts
                  </span>
                </Label>
                <Switch
                  id="charts-widget"
                  checked={config.widgets.charts}
                  onCheckedChange={(checked) => updateWidget("charts", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zone Filtering</CardTitle>
            <CardDescription>Select zones to display data from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="zone-a"
                  checked={config.zones.zoneA}
                  onCheckedChange={(checked) => updateZone("zoneA", checked as boolean)}
                />
                <Label htmlFor="zone-a" className="cursor-pointer">
                  <div>
                    <p className="font-medium">Zone A</p>
                    <p className="text-sm text-muted-foreground">
                      Living room, Kitchen, Main hall
                    </p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="zone-b"
                  checked={config.zones.zoneB}
                  onCheckedChange={(checked) => updateZone("zoneB", checked as boolean)}
                />
                <Label htmlFor="zone-b" className="cursor-pointer">
                  <div>
                    <p className="font-medium">Zone B</p>
                    <p className="text-sm text-muted-foreground">
                      Bedrooms, Bathrooms, Storage
                    </p>
                  </div>
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Configure system behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex flex-col gap-1 cursor-pointer">
                <span className="font-medium">Notifications</span>
                <span className="text-sm text-muted-foreground">
                  Enable system notifications
                </span>
              </Label>
              <Switch
                id="notifications"
                checked={config.notifications}
                onCheckedChange={(checked) =>
                  setConfig((prev) => ({ ...prev, notifications: checked }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Data Refresh Rate</Label>
              <div className="flex gap-2">
                {[1, 3, 5, 10].map((rate) => (
                  <Button
                    key={rate}
                    variant={config.refreshRate === rate ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setConfig((prev) => ({ ...prev, refreshRate: rate }))
                    }
                  >
                    {rate}s
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Current: Update every {config.refreshRate} seconds
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Save or reset configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
            <Button onClick={handleReset} variant="outline" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
