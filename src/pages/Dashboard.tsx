import { useState, useEffect } from "react";
import { Thermometer, Droplets, Sun, Activity } from "lucide-react";
import { SensorCard } from "@/components/widgets/SensorCard";
import { ChartCard } from "@/components/widgets/ChartCard";

// Mock data generator
const generateTimeSeriesData = (baseValue: number, variance: number, points: number = 20) => {
  const data = [];
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: Math.round((baseValue + Math.random() * variance - variance / 2) * 10) / 10,
    });
  }
  return data;
};

export default function Dashboard() {
  const [temperature, setTemperature] = useState(25.4);
  const [humidity, setHumidity] = useState(65);
  const [light, setLight] = useState(450);
  const [power, setPower] = useState(2.3);

  const [tempData, setTempData] = useState(generateTimeSeriesData(25, 5));
  const [humidityData, setHumidityData] = useState(generateTimeSeriesData(65, 10));
  const [lightData, setLightData] = useState(generateTimeSeriesData(450, 100));

  // Simulate realtime updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature((prev) => Math.round((prev + Math.random() * 2 - 1) * 10) / 10);
      setHumidity((prev) => Math.round(prev + Math.random() * 4 - 2));
      setLight((prev) => Math.round(prev + Math.random() * 40 - 20));
      setPower((prev) => Math.round((prev + Math.random() * 0.4 - 0.2) * 10) / 10);

      // Update charts
      setTempData((prev) => [...prev.slice(1), {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        value: Math.round((25 + Math.random() * 10 - 5) * 10) / 10,
      }]);
      setHumidityData((prev) => [...prev.slice(1), {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        value: Math.round(65 + Math.random() * 20 - 10),
      }]);
      setLightData((prev) => [...prev.slice(1), {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        value: Math.round(450 + Math.random() * 200 - 100),
      }]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Realtime sensor monitoring and control</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard
          title="Temperature"
          value={temperature}
          unit="°C"
          icon={Thermometer}
          trend="up"
          trendValue="+1.2°C from last hour"
          color="warning"
        />
        <SensorCard
          title="Humidity"
          value={humidity}
          unit="%"
          icon={Droplets}
          trend="stable"
          trendValue="No change"
          color="primary"
        />
        <SensorCard
          title="Light Intensity"
          value={light}
          unit="lux"
          icon={Sun}
          trend="down"
          trendValue="-50 lux"
          color="success"
        />
        <SensorCard
          title="Power Usage"
          value={power}
          unit="kW"
          icon={Activity}
          trend="up"
          trendValue="+0.3 kW"
          color="destructive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="Temperature History"
          data={tempData}
          color="hsl(var(--warning))"
          unit="°C"
        />
        <ChartCard
          title="Humidity History"
          data={humidityData}
          color="hsl(var(--primary))"
          unit="%"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <ChartCard
          title="Light Intensity History"
          data={lightData}
          color="hsl(var(--success))"
          unit=" lux"
        />
      </div>
    </div>
  );
}
