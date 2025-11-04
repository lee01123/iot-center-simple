import { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Thermometer, Droplets, Sun, Lightbulb, ZoomIn, ZoomOut, RotateCcw, Activity } from "lucide-react";
import { mockFloors, mockZones, getZoneLines, getZoneEquipment } from "@/data/mockSystem";
import { MapConfig, PlacedSensor } from "@/types/system";

const SENSOR_TYPES = [
  { type: "temperature", label: "Temperature", icon: Thermometer, color: "text-red-500" },
  { type: "humidity", label: "Humidity", icon: Droplets, color: "text-blue-500" },
  { type: "light", label: "Light", icon: Sun, color: "text-yellow-500" },
  { type: "led_rgb", label: "LED RGB", icon: Lightbulb, color: "text-purple-500" },
];

const getSensorColor = (status?: 'normal' | 'warning' | 'danger') => {
  switch (status) {
    case 'danger': return 'bg-red-500 border-red-600';
    case 'warning': return 'bg-yellow-500 border-yellow-600';
    case 'normal': return 'bg-green-500 border-green-600';
    default: return 'bg-gray-500 border-gray-600';
  }
};

export default function MapsView() {
  const [selectedFloor, setSelectedFloor] = useState<string>("floor-1");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedLine, setSelectedLine] = useState<string>("all");
  const [mapConfig, setMapConfig] = useState<MapConfig | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<PlacedSensor | null>(null);

  // Load map configuration
  useEffect(() => {
    const saved = localStorage.getItem("maps-configs");
    if (saved) {
      try {
        const configs: MapConfig[] = JSON.parse(saved);
        const config = configs.find((c) => c.floorId === selectedFloor);
        if (config) {
          // Simulate real-time data
          const sensorsWithData = config.sensors.map((sensor) => {
            const baseValue = Math.random() * 100;
            let status: 'normal' | 'warning' | 'danger' = 'normal';
            
            if (sensor.type === 'temperature') {
              const temp = 20 + Math.random() * 15;
              status = temp > 30 ? 'danger' : temp > 28 ? 'warning' : 'normal';
              return { ...sensor, value: Number(temp.toFixed(1)), unit: '°C', status };
            } else if (sensor.type === 'humidity') {
              const hum = 40 + Math.random() * 50;
              status = hum > 80 ? 'danger' : hum > 70 ? 'warning' : 'normal';
              return { ...sensor, value: Number(hum.toFixed(1)), unit: '%', status };
            } else if (sensor.type === 'light') {
              const light = 300 + Math.random() * 600;
              status = light > 800 ? 'danger' : light > 700 ? 'warning' : 'normal';
              return { ...sensor, value: Number(light.toFixed(0)), unit: 'lux', status };
            }
            return { ...sensor, value: Number(baseValue.toFixed(1)), unit: '', status };
          });
          setMapConfig({ ...config, sensors: sensorsWithData });
        } else {
          setMapConfig(null);
        }
      } catch (error) {
        console.error("Failed to load map:", error);
      }
    }
  }, [selectedFloor]);

  const floorZones = mockZones.filter((z) => z.floorId === selectedFloor);
  const zoneLines = selectedZone !== "all" ? getZoneLines(selectedZone) : [];

  // Filter sensors by zone and line
  const filteredSensors = !mapConfig ? [] : mapConfig.sensors.filter((sensor) => {
    if (selectedZone !== "all" && sensor.zoneId !== selectedZone) return false;
    
    // Filter by line if selected
    if (selectedLine !== "all" && selectedZone !== "all") {
      const equipment = getZoneEquipment(sensor.zoneId);
      const lineEquipment = equipment.filter((e) => e.lineId === selectedLine);
      // For demo, associate sensors with equipment based on zone
      if (lineEquipment.length === 0) return false;
    }
    
    return true;
  });

  const getSensorIcon = (type: string) => {
    return SENSOR_TYPES.find((s) => s.type === type) || SENSOR_TYPES[0];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Factory Maps</h2>
        <p className="text-muted-foreground">Real-time sensor monitoring on floor plans</p>
      </div>

      {/* Floor Selection */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
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
          <div className="flex gap-2">
            <Badge variant="outline" className="text-sm">
              <Activity className="mr-1 h-3 w-3" />
              {filteredSensors.length} sensors active
            </Badge>
          </div>
        </div>
      </Card>

      {/* Zone Tabs */}
      <Tabs value={selectedZone} onValueChange={setSelectedZone}>
        <TabsList>
          <TabsTrigger value="all">All Zones</TabsTrigger>
          {floorZones.map((zone) => (
            <TabsTrigger key={zone.id} value={zone.id}>
              {zone.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedZone} className="mt-4">
          {/* Line Filter (only shown when a specific zone is selected) */}
          {selectedZone !== "all" && zoneLines.length > 0 && (
            <Card className="p-4 mb-4">
              <div className="flex gap-4 items-end">
                <div>
                  <Label>Line</Label>
                  <Select value={selectedLine} onValueChange={setSelectedLine}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Lines</SelectItem>
                      {zoneLines.map((line) => (
                        <SelectItem key={line.id} value={line.id}>
                          {line.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Map Display */}
            <Card className="lg:col-span-3">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Floor Plan - {selectedZone === "all" ? "All Zones" : floorZones.find(z => z.id === selectedZone)?.name}</h3>
              </div>
              <div className="p-4">
                <div className="relative w-full h-[600px] bg-muted/20 rounded-lg border overflow-hidden">
                  {mapConfig?.floorPlanUrl ? (
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
                              <img
                                src={mapConfig.floorPlanUrl}
                                alt="Floor Plan"
                                className="w-full h-full object-contain"
                              />
                              {filteredSensors.map((sensor) => {
                                const sensorInfo = getSensorIcon(sensor.type);
                                const Icon = sensorInfo.icon;
                                const isSelected = selectedSensor?.id === sensor.id;
                                
                                return (
                                  <div
                                    key={sensor.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedSensor(sensor);
                                    }}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform ${
                                      isSelected ? "scale-125 z-10" : ""
                                    }`}
                                    style={{ left: `${sensor.x}%`, top: `${sensor.y}%` }}
                                  >
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-lg ${getSensorColor(sensor.status)}`}>
                                      <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    {sensor.status === 'danger' && (
                                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                                    )}
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
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No floor plan configured for this floor</p>
                        <p className="text-sm mt-2">Configure maps in Master Config</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Sensor Info Panel */}
            <Card>
              <div className="p-4 border-b">
                <h3 className="font-semibold">Sensor Info</h3>
              </div>
              <div className="p-4">
                {selectedSensor ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const sensorInfo = getSensorIcon(selectedSensor.type);
                        const Icon = sensorInfo.icon;
                        return <Icon className={`h-5 w-5 ${sensorInfo.color}`} />;
                      })()}
                      <h4 className="font-semibold">{selectedSensor.name}</h4>
                    </div>
                    
                    <Badge variant={
                      selectedSensor.status === 'danger' ? 'destructive' : 
                      selectedSensor.status === 'warning' ? 'default' : 
                      'outline'
                    }>
                      {selectedSensor.status?.toUpperCase()}
                    </Badge>

                    {selectedSensor.value !== undefined && (
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-3xl font-bold">
                          {selectedSensor.value} {selectedSensor.unit}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Current Value</div>
                      </div>
                    )}

                    <div className="space-y-2 pt-4 border-t text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="capitalize">{selectedSensor.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Zone:</span>
                        <span>{mockZones.find((z) => z.id === selectedSensor.zoneId)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Floor:</span>
                        <span>{mockFloors.find((f) => f.id === selectedSensor.floorId)?.name}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-sm">Click a sensor to view details</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Legend */}
      <Card className="p-4">
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium">Status:</span>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span className="text-sm">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500" />
              <span className="text-sm">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span className="text-sm">Danger</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
