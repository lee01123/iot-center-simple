import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Radio, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  topic: string;
  payload: string;
  timestamp: Date;
  direction: "sent" | "received";
}

export default function MqttInterface() {
  const { toast } = useToast();
  const [connected, setConnected] = useState(true);
  const [topic, setTopic] = useState("iot/device/control");
  const [payload, setPayload] = useState('{\n  "command": "toggle",\n  "device": "light-001"\n}');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      topic: "iot/device/status",
      payload: '{"device": "temp-sensor-001", "value": 25.4, "status": "online"}',
      timestamp: new Date(Date.now() - 120000),
      direction: "received",
    },
    {
      id: "2",
      topic: "iot/device/control",
      payload: '{"command": "on", "device": "light-001"}',
      timestamp: new Date(Date.now() - 60000),
      direction: "sent",
    },
    {
      id: "3",
      topic: "iot/device/response",
      payload: '{"device": "light-001", "status": "on", "success": true}',
      timestamp: new Date(Date.now() - 59000),
      direction: "received",
    },
  ]);

  const handlePublish = () => {
    try {
      JSON.parse(payload); // Validate JSON
      const newMessage: Message = {
        id: Date.now().toString(),
        topic,
        payload,
        timestamp: new Date(),
        direction: "sent",
      };
      setMessages([newMessage, ...messages]);
      toast({
        title: "Message Published",
        description: `Published to ${topic}`,
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please enter valid JSON payload",
        variant: "destructive",
      });
    }
  };

  const handleConnect = () => {
    setConnected(!connected);
    toast({
      title: connected ? "Disconnected" : "Connected",
      description: connected ? "MQTT broker disconnected" : "Connected to MQTT broker",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">MQTT Interface</h2>
        <p className="text-muted-foreground">Direct communication with IoT devices via MQTT</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5" />
              Connection
            </CardTitle>
            <CardDescription>MQTT broker status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Broker URL</label>
              <Input value="mqtt://broker.example.com:1883" disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Client ID</label>
              <Input value="iot-dashboard-client-001" disabled />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                {connected ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <span className="text-sm font-medium">
                  {connected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <Badge variant={connected ? "default" : "destructive"}>
                {connected ? "Active" : "Inactive"}
              </Badge>
            </div>
            <Button onClick={handleConnect} className="w-full" variant={connected ? "destructive" : "default"}>
              {connected ? "Disconnect" : "Connect"}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Publish Message
            </CardTitle>
            <CardDescription>Send commands to IoT devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="iot/device/control"
                disabled={!connected}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Payload (JSON)</label>
              <Textarea
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                placeholder='{"command": "toggle"}'
                className="font-mono text-sm"
                rows={8}
                disabled={!connected}
              />
            </div>
            <Button onClick={handlePublish} disabled={!connected} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Publish Message
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
          <CardDescription>Recent MQTT messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border ${
                  message.direction === "sent"
                    ? "bg-primary/5 border-primary/20"
                    : "bg-muted/50 border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={message.direction === "sent" ? "default" : "secondary"}>
                      {message.direction === "sent" ? "SENT" : "RECEIVED"}
                    </Badge>
                    <span className="text-sm font-medium">{message.topic}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <pre className="text-xs font-mono bg-background/50 p-3 rounded overflow-x-auto">
                  {JSON.stringify(JSON.parse(message.payload), null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
