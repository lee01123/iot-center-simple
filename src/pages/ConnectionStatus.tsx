import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wifi, WifiOff, Activity } from "lucide-react";

interface Device {
  id: string;
  name: string;
  type: string;
  zone: string;
  status: "online" | "offline";
  lastSeen: Date;
  signalStrength: number;
}

const mockDevices: Device[] = [
  { id: "dev-001", name: "Temperature Sensor A", type: "Sensor", zone: "Zone A", status: "online", lastSeen: new Date(), signalStrength: 95 },
  { id: "dev-002", name: "Light Controller A", type: "Controller", zone: "Zone A", status: "online", lastSeen: new Date(), signalStrength: 88 },
  { id: "dev-003", name: "Fan Controller A", type: "Controller", zone: "Zone A", status: "online", lastSeen: new Date(), signalStrength: 92 },
  { id: "dev-004", name: "Temperature Sensor B", type: "Sensor", zone: "Zone B", status: "online", lastSeen: new Date(Date.now() - 2000), signalStrength: 78 },
  { id: "dev-005", name: "Light Controller B", type: "Controller", zone: "Zone B", status: "offline", lastSeen: new Date(Date.now() - 300000), signalStrength: 0 },
  { id: "dev-006", name: "HVAC Unit", type: "Controller", zone: "Zone A", status: "online", lastSeen: new Date(), signalStrength: 85 },
  { id: "dev-007", name: "Humidity Sensor A", type: "Sensor", zone: "Zone A", status: "online", lastSeen: new Date(), signalStrength: 91 },
  { id: "dev-008", name: "Motion Sensor B", type: "Sensor", zone: "Zone B", status: "offline", lastSeen: new Date(Date.now() - 600000), signalStrength: 0 },
];

export default function ConnectionStatus() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [filter, setFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");

  // Simulate status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prev) =>
        prev.map((device) => {
          if (device.status === "online" && Math.random() > 0.95) {
            return { ...device, lastSeen: new Date() };
          }
          return device;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredDevices = devices.filter((device) => {
    const matchesName = device.name.toLowerCase().includes(filter.toLowerCase());
    const matchesZone = zoneFilter === "all" || device.zone === zoneFilter;
    return matchesName && matchesZone;
  });

  const onlineCount = devices.filter((d) => d.status === "online").length;
  const offlineCount = devices.filter((d) => d.status === "offline").length;

  const getTimeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Connection Status</h2>
        <p className="text-muted-foreground">Monitor device connectivity and health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Total Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{devices.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wifi className="h-4 w-4 text-success" />
              Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{onlineCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-destructive" />
              Offline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{offlineCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Device List</CardTitle>
          <CardDescription>Filter and monitor all connected devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search devices..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-sm"
            />
            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="Zone A">Zone A</SelectItem>
                <SelectItem value="Zone B">Zone B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredDevices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      device.status === "online" ? "bg-success/10" : "bg-destructive/10"
                    }`}
                  >
                    {device.status === "online" ? (
                      <Wifi className="h-5 w-5 text-success" />
                    ) : (
                      <WifiOff className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {device.type} • {device.zone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Last Seen</p>
                    <p className="text-sm font-medium">{getTimeSince(device.lastSeen)}</p>
                  </div>
                  {device.status === "online" && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Signal</p>
                      <p className="text-sm font-medium">{device.signalStrength}%</p>
                    </div>
                  )}
                  <Badge variant={device.status === "online" ? "default" : "destructive"}>
                    {device.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
