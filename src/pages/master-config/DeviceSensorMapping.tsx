import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SensorMapping {
  id: string;
  deviceId: string;
  deviceName: string;
  sensorType: string;
  sensorName: string;
  mqttTopic: string;
}

const SENSOR_TYPES = [
  "Temperature",
  "Humidity",
  "Pressure",
  "Light",
  "Vibration",
  "Power",
  "Flow",
  "Level",
];

const DEFAULT_MAPPINGS: SensorMapping[] = [
  {
    id: "1",
    deviceId: "DEV001",
    deviceName: "Temperature Monitor A",
    sensorType: "Temperature",
    sensorName: "Temp Sensor 1",
    mqttTopic: "factory/zone1/temp001",
  },
  {
    id: "2",
    deviceId: "DEV002",
    deviceName: "Humidity Monitor A",
    sensorType: "Humidity",
    sensorName: "Humidity Sensor 1",
    mqttTopic: "factory/zone1/humid001",
  },
];

export default function DeviceSensorMapping() {
  const [mappings, setMappings] = useState<SensorMapping[]>(() => {
    const saved = localStorage.getItem("device-sensor-mappings");
    return saved ? JSON.parse(saved) : DEFAULT_MAPPINGS;
  });
  const { toast } = useToast();

  const addMapping = () => {
    const newMapping: SensorMapping = {
      id: Date.now().toString(),
      deviceId: "",
      deviceName: "",
      sensorType: "Temperature",
      sensorName: "",
      mqttTopic: "",
    };
    setMappings([...mappings, newMapping]);
  };

  const removeMapping = (id: string) => {
    setMappings(mappings.filter((m) => m.id !== id));
  };

  const updateMapping = (id: string, field: keyof SensorMapping, value: string) => {
    setMappings(
      mappings.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const saveConfig = () => {
    localStorage.setItem("device-sensor-mappings", JSON.stringify(mappings));
    toast({
      title: "Configuration Saved",
      description: "Device-Sensor mappings have been saved successfully.",
    });
  };

  const resetToDefaults = () => {
    setMappings(DEFAULT_MAPPINGS);
    localStorage.setItem("device-sensor-mappings", JSON.stringify(DEFAULT_MAPPINGS));
    toast({
      title: "Reset to Defaults",
      description: "Configuration has been reset to default values.",
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Device & Sensor Mapping</h2>
            <p className="text-muted-foreground">
              Configure the mapping between devices and sensors
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button onClick={addMapping}>
              <Plus className="mr-2 h-4 w-4" />
              Add Mapping
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {mappings.map((mapping) => (
            <Card key={mapping.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Device ID</Label>
                  <Input
                    value={mapping.deviceId}
                    onChange={(e) =>
                      updateMapping(mapping.id, "deviceId", e.target.value)
                    }
                    placeholder="DEV001"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Device Name</Label>
                  <Input
                    value={mapping.deviceName}
                    onChange={(e) =>
                      updateMapping(mapping.id, "deviceName", e.target.value)
                    }
                    placeholder="Temperature Monitor"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sensor Type</Label>
                  <Select
                    value={mapping.sensorType}
                    onValueChange={(value) =>
                      updateMapping(mapping.id, "sensorType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SENSOR_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sensor Name</Label>
                  <Input
                    value={mapping.sensorName}
                    onChange={(e) =>
                      updateMapping(mapping.id, "sensorName", e.target.value)
                    }
                    placeholder="Sensor 1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>MQTT Topic</Label>
                  <Input
                    value={mapping.mqttTopic}
                    onChange={(e) =>
                      updateMapping(mapping.id, "mqttTopic", e.target.value)
                    }
                    placeholder="factory/zone1/temp001"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeMapping(mapping.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={saveConfig}>Save Configuration</Button>
        </div>
      </Card>
    </div>
  );
}
