import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Device {
  id: string;
  name: string;
  zone: string;
  currentVersion: string;
  updateStatus: "up-to-date" | "pending" | "updating" | "failed";
  progress?: number;
}

const mockDevices: Device[] = [
  { id: "dev-001", name: "Temperature Sensor A", zone: "Zone A", currentVersion: "v2.3.1", updateStatus: "up-to-date" },
  { id: "dev-002", name: "Light Controller A", zone: "Zone A", currentVersion: "v2.3.0", updateStatus: "pending" },
  { id: "dev-003", name: "Fan Controller A", zone: "Zone A", currentVersion: "v2.3.1", updateStatus: "up-to-date" },
  { id: "dev-004", name: "Temperature Sensor B", zone: "Zone B", currentVersion: "v2.3.1", updateStatus: "up-to-date" },
  { id: "dev-005", name: "Light Controller B", zone: "Zone B", currentVersion: "v2.2.8", updateStatus: "pending" },
  { id: "dev-006", name: "HVAC Unit", zone: "Zone A", currentVersion: "v2.3.0", updateStatus: "pending" },
];

export default function FotaManagement() {
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [selectedVersion, setSelectedVersion] = useState("v2.3.1");
  const [zoneFilter, setZoneFilter] = useState("all");

  const handleUpdate = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? { ...device, updateStatus: "updating" as const, progress: 0 }
          : device
      )
    );

    // Simulate update progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId
            ? { ...device, progress: Math.min(progress, 100) }
            : device
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        setDevices((prev) =>
          prev.map((device) =>
            device.id === deviceId
              ? {
                  ...device,
                  updateStatus: "up-to-date" as const,
                  currentVersion: selectedVersion,
                  progress: undefined,
                }
              : device
          )
        );
        toast({
          title: "Update Complete",
          description: `Device ${deviceId} updated to ${selectedVersion}`,
        });
      }
    }, 500);
  };

  const handleBulkUpdate = () => {
    const pendingDevices = devices.filter(
      (d) => d.updateStatus === "pending" && (zoneFilter === "all" || d.zone === zoneFilter)
    );
    
    pendingDevices.forEach((device) => {
      setTimeout(() => handleUpdate(device.id), Math.random() * 1000);
    });

    toast({
      title: "Bulk Update Started",
      description: `Updating ${pendingDevices.length} devices`,
    });
  };

  const filteredDevices = devices.filter(
    (device) => zoneFilter === "all" || device.zone === zoneFilter
  );

  const getStatusIcon = (status: Device["updateStatus"]) => {
    switch (status) {
      case "up-to-date":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "pending":
        return <Clock className="h-5 w-5 text-warning" />;
      case "updating":
        return <Download className="h-5 w-5 text-primary animate-pulse" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusBadge = (status: Device["updateStatus"]) => {
    switch (status) {
      case "up-to-date":
        return <Badge variant="default">Up to Date</Badge>;
      case "pending":
        return <Badge variant="secondary">Update Available</Badge>;
      case "updating":
        return <Badge>Updating...</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const upToDateCount = devices.filter((d) => d.updateStatus === "up-to-date").length;
  const pendingCount = devices.filter((d) => d.updateStatus === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">FOTA Management</h2>
        <p className="text-muted-foreground">Firmware Over-The-Air updates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Up to Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{upToDateCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              Pending Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{pendingCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Firmware Update
          </CardTitle>
          <CardDescription>Deploy new firmware to devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v2.3.1">v2.3.1 (Latest)</SelectItem>
                <SelectItem value="v2.3.0">v2.3.0</SelectItem>
                <SelectItem value="v2.2.8">v2.2.8</SelectItem>
              </SelectContent>
            </Select>
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
            <Button onClick={handleBulkUpdate} disabled={pendingCount === 0}>
              Update All Pending Devices
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device List</CardTitle>
          <CardDescription>Manage firmware for individual devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDevices.map((device) => (
              <div
                key={device.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(device.updateStatus)}
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {device.zone} • Current: {device.currentVersion}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(device.updateStatus)}
                    {device.updateStatus === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(device.id)}
                      >
                        Update Now
                      </Button>
                    )}
                  </div>
                </div>
                {device.updateStatus === "updating" && device.progress !== undefined && (
                  <div className="space-y-2">
                    <Progress value={device.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                      {device.progress}% complete
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
