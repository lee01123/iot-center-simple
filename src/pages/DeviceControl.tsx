import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Fan, Thermometer, Power } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DeviceControl() {
  const { toast } = useToast();
  const [devices, setDevices] = useState({
    light1: true,
    light2: false,
    fan: true,
    hvac: false,
  });

  const [brightness, setBrightness] = useState([75]);
  const [fanSpeed, setFanSpeed] = useState([60]);
  const [temperature, setTemperature] = useState([22]);
  const [mode, setMode] = useState("auto");

  const handleToggle = (device: string, state: boolean) => {
    setDevices((prev) => ({ ...prev, [device]: state }));
    toast({
      title: "Device Updated",
      description: `${device} is now ${state ? "ON" : "OFF"}`,
    });
  };

  const handleCommand = (command: string) => {
    toast({
      title: "Command Sent",
      description: `Executing: ${command}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Device Control</h2>
        <p className="text-muted-foreground">Control your IoT devices remotely</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lighting Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-warning" />
              Lighting Control
            </CardTitle>
            <CardDescription>Manage lights and brightness</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Living Room Light</p>
                <p className="text-sm text-muted-foreground">Zone A</p>
              </div>
              <Switch
                checked={devices.light1}
                onCheckedChange={(checked) => handleToggle("light1", checked)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Brightness: {brightness[0]}%</label>
              <Slider
                value={brightness}
                onValueChange={setBrightness}
                max={100}
                step={1}
                disabled={!devices.light1}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Bedroom Light</p>
                <p className="text-sm text-muted-foreground">Zone B</p>
              </div>
              <Switch
                checked={devices.light2}
                onCheckedChange={(checked) => handleToggle("light2", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Fan Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fan className="h-5 w-5 text-primary" />
              Fan Control
            </CardTitle>
            <CardDescription>Adjust fan speed and mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ceiling Fan</p>
                <p className="text-sm text-muted-foreground">Zone A</p>
              </div>
              <Switch
                checked={devices.fan}
                onCheckedChange={(checked) => handleToggle("fan", checked)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Speed: {fanSpeed[0]}%</label>
              <Slider
                value={fanSpeed}
                onValueChange={setFanSpeed}
                max={100}
                step={1}
                disabled={!devices.fan}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mode</label>
              <Select value={mode} onValueChange={setMode} disabled={!devices.fan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="sleep">Sleep</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* HVAC Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-destructive" />
              HVAC Control
            </CardTitle>
            <CardDescription>Temperature management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Air Conditioner</p>
                <p className="text-sm text-muted-foreground">Main Unit</p>
              </div>
              <Switch
                checked={devices.hvac}
                onCheckedChange={(checked) => handleToggle("hvac", checked)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Temperature: {temperature[0]}°C</label>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                min={16}
                max={30}
                step={1}
                disabled={!devices.hvac}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCommand("Cool Mode")}
                disabled={!devices.hvac}
                className="flex-1"
              >
                Cool
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCommand("Heat Mode")}
                disabled={!devices.hvac}
                className="flex-1"
              >
                Heat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCommand("Fan Mode")}
                disabled={!devices.hvac}
                className="flex-1"
              >
                Fan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Power className="h-5 w-5 text-success" />
              Quick Actions
            </CardTitle>
            <CardDescription>Preset commands and scenarios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full"
              variant="default"
              onClick={() => handleCommand("All Devices ON")}
            >
              Turn All ON
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleCommand("All Devices OFF")}
            >
              Turn All OFF
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleCommand("Night Mode")}
            >
              Night Mode
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleCommand("Away Mode")}
            >
              Away Mode
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
