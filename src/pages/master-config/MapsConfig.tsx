import { useState, useRef, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplets, Sun, Lightbulb, Upload, Download, Save, Trash2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { mockFloors, mockZones } from "@/data/mockSystem";
import { PlacedSensor, MapConfig } from "@/types/system";

const SENSOR_TYPES = [
  { type: "temperature", label: "Temperature", icon: Thermometer, color: "text-red-500" },
  { type: "humidity", label: "Humidity", icon: Droplets, color: "text-blue-500" },
  { type: "light", label: "Light", icon: Sun, color: "text-yellow-500" },
  { type: "led_rgb", label: "LED RGB", icon: Lightbulb, color: "text-purple-500" },
];

export default function MapsConfig() {
  const [selectedFloor, setSelectedFloor] = useState<string>("floor-1");
  const [mapConfigs, setMapConfigs] = useState<MapConfig[]>([]);
  const [currentConfig, setCurrentConfig] = useState<MapConfig | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [draggedSensorType, setDraggedSensorType] = useState<string | null>(null);
  const [draggingSensor, setDraggingSensor] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Load configs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("maps-configs");
    if (saved) {
      try {
        const configs = JSON.parse(saved);
        setMapConfigs(configs);
      } catch (error) {
        console.error("Failed to load configs:", error);
      }
    }
  }, []);

  // Load current floor config
  useEffect(() => {
    const config = mapConfigs.find((c) => c.floorId === selectedFloor);
    setCurrentConfig(config || { floorId: selectedFloor, floorPlanUrl: "", sensors: [] });
  }, [selectedFloor, mapConfigs]);

  const saveConfig = () => {
    if (!currentConfig) return;
    
    const updatedConfigs = mapConfigs.filter((c) => c.floorId !== selectedFloor);
    updatedConfigs.push(currentConfig);
    setMapConfigs(updatedConfigs);
    localStorage.setItem("maps-configs", JSON.stringify(updatedConfigs));
    toast.success("Map configuration saved");
  };

  const resetToDefaults = () => {
    if (window.confirm("Reset this floor's map configuration?")) {
      const defaultConfig: MapConfig = {
        floorId: selectedFloor,
        floorPlanUrl: "",
        sensors: [],
      };
      setCurrentConfig(defaultConfig);
      toast.success("Reset to defaults");
    }
  };

  const exportConfig = () => {
    if (!currentConfig) return;
    const blob = new Blob([JSON.stringify(currentConfig, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `map_config_${selectedFloor}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Configuration exported");
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config: MapConfig = JSON.parse(e.target?.result as string);
        setCurrentConfig({ ...config, floorId: selectedFloor });
        toast.success("Configuration imported");
      } catch (error) {
        toast.error("Failed to import configuration");
      }
    };
    reader.readAsText(file);
  };

  const handleFloorPlanUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentConfig) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentConfig({
        ...currentConfig,
        floorPlanUrl: e.target?.result as string,
      });
      toast.success("Floor plan uploaded");
    };
    reader.readAsDataURL(file);
  };

  const handleDragStartFromPalette = (type: string) => {
    setDraggedSensorType(type);
  };

  const handleDragStartFromPlaced = (sensorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingSensor(sensorId);
  };

  const handleDropOnMap = (e: React.MouseEvent) => {
    if (!mapContainerRef.current || !currentConfig) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (draggedSensorType) {
      const floorZones = mockZones.filter((z) => z.floorId === selectedFloor);
      const targetZone = selectedZone === "all" ? floorZones[0].id : selectedZone;
      
      const newSensor: PlacedSensor = {
        id: `sensor_${Date.now()}`,
        type: draggedSensorType,
        x,
        y,
        zoneId: targetZone,
        floorId: selectedFloor,
        name: `${draggedSensorType}_${currentConfig.sensors.length + 1}`,
      };
      setCurrentConfig({
        ...currentConfig,
        sensors: [...currentConfig.sensors, newSensor],
      });
      toast.success("Sensor placed");
      setDraggedSensorType(null);
    } else if (draggingSensor) {
      setCurrentConfig({
        ...currentConfig,
        sensors: currentConfig.sensors.map((s) =>
          s.id === draggingSensor ? { ...s, x, y } : s
        ),
      });
      setDraggingSensor(null);
    }
  };

  const deleteSensor = (id: string) => {
    if (!currentConfig) return;
    setCurrentConfig({
      ...currentConfig,
      sensors: currentConfig.sensors.filter((s) => s.id !== id),
    });
    if (selectedSensor === id) setSelectedSensor(null);
    toast.success("Sensor removed");
  };

  const clearAllSensors = () => {
    if (!currentConfig) return;
    if (window.confirm("Remove all sensors from this floor?")) {
      setCurrentConfig({
        ...currentConfig,
        sensors: [],
      });
      setSelectedSensor(null);
      toast.success("All sensors removed");
    }
  };

  const floorZones = mockZones.filter((z) => z.floorId === selectedFloor);
  const filteredSensors = !currentConfig
    ? []
    : selectedZone === "all"
    ? currentConfig.sensors
    : currentConfig.sensors.filter((s) => s.zoneId === selectedZone);

  const getSensorIcon = (type: string) => {
    return SENSOR_TYPES.find((s) => s.type === type) || SENSOR_TYPES[0];
  };

  const selectedSensorData = currentConfig?.sensors.find((s) => s.id === selectedSensor);

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Maps Configuration</h2>
            <p className="text-muted-foreground">
              Upload floor plans and configure sensor positions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-4">
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
            <Label htmlFor="floor-plan-upload">Upload Floor Plan</Label>
            <Input
              id="floor-plan-upload"
              type="file"
              accept="image/*"
              onChange={handleFloorPlanUpload}
              className="w-64"
            />
          </div>

          <div>
            <Label>Zone Filter</Label>
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
            <Button onClick={saveConfig} variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={exportConfig} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={importConfig}
              className="hidden"
            />
            <Button onClick={clearAllSensors} variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sensor Palette */}
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-semibold">Sensor Palette</h3>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-sm text-muted-foreground mb-4">Drag sensors to map</p>
              {SENSOR_TYPES.map((sensor) => {
                const Icon = sensor.icon;
                return (
                  <div
                    key={sensor.type}
                    draggable
                    onDragStart={() => handleDragStartFromPalette(sensor.type)}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-move hover:bg-accent/50"
                  >
                    <Icon className={`h-5 w-5 ${sensor.color}`} />
                    <span className="font-medium">{sensor.label}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Map Area */}
          <Card className="lg:col-span-2">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Floor Plan</h3>
              <Badge variant="outline">{filteredSensors.length} sensors</Badge>
            </div>
            <div className="p-4">
              <div
                ref={mapContainerRef}
                className="relative w-full h-[600px] bg-muted/20 rounded-lg border-2 border-dashed overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDropOnMap}
                onClick={handleDropOnMap}
              >
                {currentConfig?.floorPlanUrl ? (
                  <TransformWrapper initialScale={1} minScale={0.5} maxScale={4}>
                    {({ zoomIn, zoomOut, resetTransform }) => (
                      <>
                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                          <Button size="icon" variant="secondary" onClick={() => zoomIn()}>
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="secondary" onClick={() => zoomOut()}>
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="secondary" onClick={() => resetTransform()}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <TransformComponent wrapperClass="!w-full !h-full">
                          <div className="relative w-full h-full">
                            <img src={currentConfig.floorPlanUrl} alt="Floor Plan" className="w-full h-full object-contain" />
                            {filteredSensors.map((sensor) => {
                              const sensorInfo = getSensorIcon(sensor.type);
                              const Icon = sensorInfo.icon;
                              const isSelected = selectedSensor === sensor.id;
                              return (
                                <div
                                  key={sensor.id}
                                  draggable
                                  onDragStart={(e) => handleDragStartFromPlaced(sensor.id, e)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSensor(sensor.id);
                                  }}
                                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move hover:scale-110 ${
                                    isSelected ? "scale-125 z-10" : ""
                                  }`}
                                  style={{ left: `${sensor.x}%`, top: `${sensor.y}%` }}
                                >
                                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-lg ${
                                    isSelected ? "bg-primary border-primary" : "bg-card border-border"
                                  }`}>
                                    <Icon className={`h-5 w-5 ${isSelected ? "text-primary-foreground" : sensorInfo.color}`} />
                                  </div>
                                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card px-2 py-1 rounded text-xs border shadow-sm">
                                    {sensor.name}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </TransformComponent>
                      </>
                    )}
                  </TransformWrapper>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Upload a floor plan to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Sensor Info */}
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-semibold">Sensor Info</h3>
            </div>
            <div className="p-4">
              {selectedSensorData ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const sensorInfo = getSensorIcon(selectedSensorData.type);
                      const Icon = sensorInfo.icon;
                      return <Icon className={`h-5 w-5 ${sensorInfo.color}`} />;
                    })()}
                    <h4 className="font-semibold">{selectedSensorData.name}</h4>
                  </div>
                  <div className="space-y-2 pt-4 border-t text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{selectedSensorData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zone:</span>
                      <span>{mockZones.find((z) => z.id === selectedSensorData.zoneId)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Position:</span>
                      <span>
                        X: {selectedSensorData.x.toFixed(1)}%, Y: {selectedSensorData.y.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => deleteSensor(selectedSensorData.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">Click a sensor to view details</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}
