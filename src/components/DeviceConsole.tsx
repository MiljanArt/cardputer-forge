import { motion } from 'framer-motion';
import { Terminal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
const mockConsoleOutput = [
  'Cardputer ADV v1.0.0 initializing...',
  'Platform: ESP32-S3',
  'Connecting to Wi-Fi...',
  'Connected to MyWiFi_SSID',
  'IP Address: 192.168.1.123',
  'System OK. Awaiting commands.',
];
export function DeviceConsole() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Serial Console</CardTitle>
            <CardDescription>Live output from your device.</CardDescription>
          </div>
          <Button variant="outline" size="icon" disabled>
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72 w-full rounded-md border bg-secondary/50 p-4">
            <div className="font-mono text-sm text-secondary-foreground">
              {mockConsoleOutput.map((line, index) => (
                <div key={index} className="flex">
                  <span className="text-muted-foreground mr-2">{`>`}</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-4 flex w-full items-center space-x-2">
            <div className="relative flex-grow">
              <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Send command..."
                disabled
              />
            </div>
            <Button type="submit" disabled>Send</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}