import { Floor, Zone, Line, Equipment, Device, Sensor } from '@/types/system';

// Mock Floors
export const mockFloors: Floor[] = [
  { id: 'floor-1', name: 'Floor 1' },
  { id: 'floor-2', name: 'Floor 2' },
];

// Mock Zones
export const mockZones: Zone[] = [
  { id: 'zone-1', name: 'Zone 1', floorId: 'floor-1' },
  { id: 'zone-2', name: 'Zone 2', floorId: 'floor-1' },
  { id: 'zone-3', name: 'Zone 3', floorId: 'floor-1' },
  { id: 'zone-1-2f', name: 'Zone 1-2F', floorId: 'floor-2' },
  { id: 'zone-2-2f', name: 'Zone 2-2F', floorId: 'floor-2' },
  { id: 'zone-3-2f', name: 'Zone 3-2F', floorId: 'floor-2' },
];

// Mock Lines
export const mockLines: Line[] = [
  { id: 'line-a-z1', name: 'Line A', zoneId: 'zone-1' },
  { id: 'line-b-z1', name: 'Line B', zoneId: 'zone-1' },
  { id: 'line-c-z1', name: 'Line C', zoneId: 'zone-1' },
  { id: 'line-a-z2', name: 'Line A', zoneId: 'zone-2' },
  { id: 'line-b-z2', name: 'Line B', zoneId: 'zone-2' },
  { id: 'line-a-z3', name: 'Line A', zoneId: 'zone-3' },
  { id: 'line-b-z3', name: 'Line B', zoneId: 'zone-3' },
  { id: 'line-a-z1-2f', name: 'Line A', zoneId: 'zone-1-2f' },
  { id: 'line-b-z1-2f', name: 'Line B', zoneId: 'zone-1-2f' },
  { id: 'line-a-z2-2f', name: 'Line A', zoneId: 'zone-2-2f' },
  { id: 'line-a-z3-2f', name: 'Line A', zoneId: 'zone-3-2f' },
];

// Helper to generate random sensor value with status
const generateSensorData = (baseValue: number, unit: string) => {
  const variance = Math.random() * 10 - 5;
  const value = Number((baseValue + variance).toFixed(1));
  let status: 'normal' | 'warning' | 'danger' = 'normal';
  
  if (unit === '°C') {
    if (value > 30 || value < 15) status = 'danger';
    else if (value > 28 || value < 18) status = 'warning';
  } else if (unit === '%') {
    if (value > 80 || value < 30) status = 'danger';
    else if (value > 70 || value < 40) status = 'warning';
  } else if (unit === 'lux') {
    if (value > 800 || value < 200) status = 'danger';
    else if (value > 700 || value < 300) status = 'warning';
  }
  
  return { value, status };
};

// Mock Equipment with Devices and Sensors
export const mockEquipment: Equipment[] = [
  {
    id: 'eq-1',
    name: 'Assembly Machine 1',
    process: 'Assembly',
    lineId: 'line-a-z1',
    devices: [
      {
        id: 'dev-1',
        name: 'Temperature Monitor',
        type: 'temperature',
        sensors: [
          {
            id: 'sen-1',
            name: 'Temp Sensor A',
            type: 'temperature',
            ...generateSensorData(25, '°C'),
            unit: '°C',
          },
        ],
      },
      {
        id: 'dev-2',
        name: 'Humidity Sensor',
        type: 'humidity',
        sensors: [
          {
            id: 'sen-2',
            name: 'Humidity Sensor A',
            type: 'humidity',
            ...generateSensorData(55, '%'),
            unit: '%',
          },
        ],
      },
    ],
  },
  {
    id: 'eq-2',
    name: 'Testing Unit 1',
    process: 'Testing',
    lineId: 'line-a-z1',
    devices: [
      {
        id: 'dev-3',
        name: 'Light Sensor',
        type: 'light',
        sensors: [
          {
            id: 'sen-3',
            name: 'Light Sensor A',
            type: 'light',
            ...generateSensorData(500, 'lux'),
            unit: 'lux',
          },
        ],
      },
    ],
  },
  {
    id: 'eq-3',
    name: 'Assembly Machine 2',
    process: 'Assembly',
    lineId: 'line-b-z1',
    devices: [
      {
        id: 'dev-4',
        name: 'Temperature Monitor',
        type: 'temperature',
        sensors: [
          {
            id: 'sen-4',
            name: 'Temp Sensor B',
            type: 'temperature',
            ...generateSensorData(24, '°C'),
            unit: '°C',
          },
        ],
      },
    ],
  },
  {
    id: 'eq-4',
    name: 'Packaging Unit 1',
    process: 'Packaging',
    lineId: 'line-a-z2',
    devices: [
      {
        id: 'dev-5',
        name: 'Pressure Sensor',
        type: 'pressure',
        sensors: [
          {
            id: 'sen-5',
            name: 'Pressure Sensor A',
            type: 'pressure',
            ...generateSensorData(100, 'kPa'),
            unit: 'kPa',
          },
        ],
      },
    ],
  },
  {
    id: 'eq-5',
    name: 'Quality Check Station',
    process: 'Quality Control',
    lineId: 'line-a-z3',
    devices: [
      {
        id: 'dev-6',
        name: 'Vision System',
        type: 'camera',
        sensors: [
          {
            id: 'sen-6',
            name: 'Camera Sensor A',
            type: 'camera',
            value: 98.5,
            unit: '% OK',
            status: 'normal',
          },
        ],
      },
    ],
  },
];

export const getFloorZones = (floorId: string) => {
  return mockZones.filter(z => z.floorId === floorId);
};

export const getZoneLines = (zoneId: string) => {
  return mockLines.filter(l => l.zoneId === zoneId);
};

export const getLineEquipment = (lineId: string) => {
  return mockEquipment.filter(e => e.lineId === lineId);
};

export const getZoneEquipment = (zoneId: string) => {
  const lines = getZoneLines(zoneId);
  const lineIds = lines.map(l => l.id);
  return mockEquipment.filter(e => lineIds.includes(e.lineId));
};

export const getFloorEquipment = (floorId: string) => {
  const zones = getFloorZones(floorId);
  const zoneIds = zones.map(z => z.id);
  const lines = mockLines.filter(l => zoneIds.includes(l.zoneId));
  const lineIds = lines.map(l => l.id);
  return mockEquipment.filter(e => lineIds.includes(e.lineId));
};
