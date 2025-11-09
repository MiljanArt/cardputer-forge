import { motion } from 'framer-motion';
import { Plug, Usb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCardputer } from '@/hooks/useCardputer';
import { useDeviceStore } from '@/store/deviceStore';
export function ConnectDevice() {
  const { connect } = useCardputer();
  const isConnecting = useDeviceStore((s) => s.isConnecting);
  const isSupported = useDeviceStore((s) => s.isSupported);
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full p-4 w-fit mb-4">
              <Usb className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Connect your Cardputer</CardTitle>
            <CardDescription>
              Plug in your device and click the button below to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {!isSupported && (
              <div className="text-center text-destructive p-3 bg-destructive/10 rounded-md">
                <p className="font-semibold">Browser Not Supported</p>
                <p className="text-sm">
                  Please use a browser that supports the Web Serial API, like Google Chrome or Microsoft Edge.
                </p>
              </div>
            )}
            <Button
              size="lg"
              className="w-full gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
              onClick={connect}
              disabled={isConnecting || !isSupported}
            >
              {isConnecting ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-background border-t-transparent rounded-full" />
                  Connecting...
                </>
              ) : (
                <>
                  <Plug className="h-5 w-5" />
                  Connect Device
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center px-4">
              Your browser will ask you to select a serial port. Choose the one corresponding to your Cardputer.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}