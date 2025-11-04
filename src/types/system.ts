// System hierarchy types
export interface Sensor {
  id: string;
  name: string;
  type: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'danger';
}

export interface Device {
  id: string;
  name: string;
  type: string;
  sensors: Sensor[];
}

export interface Equipment {
  id: string;
  name: string;
  process: string;
  devices: Device[];
  lineId: string;
}

export interface Line {
  id: string;
  name: string;
  zoneId: string;
}

export interface Zone {
  id: string;
  name: string;
  floorId: string;
}

export interface Floor {
  id: string;
  name: string;
}

export interface PlacedSensor {
  id: string;
  type: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  zoneId: string;
  floorId: string;
  status?: 'normal' | 'warning' | 'danger';
  value?: number;
  unit?: string;
}

export interface MapConfig {
  floorId: string;
  floorPlanUrl: string;
  sensors: PlacedSensor[];
}

export interface DashboardLayout {
  floorId: string;
  zoneId: string;
  layout: Array<{
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
  widgets: Array<{
    id: string;
    type: 'sensor' | 'chart' | 'alert' | 'map';
    config: any;
  }>;
}
