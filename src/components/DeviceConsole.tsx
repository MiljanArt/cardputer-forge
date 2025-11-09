import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useDeviceStore } from '@/store/deviceStore';
import { useCardputer } from '@/hooks/useCardputer';
export function DeviceConsole() {
  const { write } = useCardputer();
  const isConnected = useDeviceStore((s) => s.isConnected);
  const consoleOutput = useDeviceStore((s) => s.consoleOutput);
  const clearConsole = useDeviceStore((s) => s.clearConsole);
  const [command, setCommand] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [consoleOutput]);
  const handleSendCommand = () => {
    if (!command.trim() || !isConnected) return;
    write(command);
    setCommand('');
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendCommand();
    }
  };
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
          <Button variant="outline" size="icon" onClick={clearConsole} disabled={!isConnected}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear Console</span>
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72 w-full rounded-md border bg-secondary/50 p-4" ref={scrollAreaRef}>
            <div className="font-mono text-sm text-secondary-foreground">
              {consoleOutput.length > 0 ? (
                consoleOutput.map((line, index) => (
                  <div key={index} className="flex">
                    <span className="text-muted-foreground mr-2 select-none">{`>`}</span>
                    <span className="whitespace-pre-wrap break-all">{line}</span>
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <p>{isConnected ? 'Waiting for device output...' : 'Connect device to see console output.'}</p>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="mt-4 flex w-full items-center space-x-2">
            <div className="relative flex-grow">
              <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Send command..."
                className="pl-10"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!isConnected}
              />
            </div>
            <Button onClick={handleSendCommand} disabled={!isConnected || !command.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}