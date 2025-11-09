import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Zap, FileCheck2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDeviceStore } from '@/store/deviceStore';
import { useCardputer } from '@/hooks/useCardputer';
import { toast } from 'sonner';
export function FirmwareFlasher() {
  const [file, setFile] = useState<File | null>(null);
  const { flashFirmware } = useCardputer();
  const isConnected = useDeviceStore((s) => s.isConnected);
  const flashingProgress = useDeviceStore((s) => s.flashingProgress);
  const flashingStatus = useDeviceStore((s) => s.flashingStatus);
  const deviceStatus = useDeviceStore((s) => s.deviceInfo?.status);
  const isFlashing = deviceStatus === 'Flashing';
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.bin')) {
        setFile(selectedFile);
      } else {
        toast.error('Invalid file type. Please select a .bin file.');
        setFile(null);
        event.target.value = ''; // Reset file input
      }
    }
  };
  const handleFlash = async () => {
    if (!file) {
      toast.warning('Please select a firmware file first.');
      return;
    }
    if (!isConnected) {
      toast.error('Device not connected.');
      return;
    }
    try {
      const fileData = await file.arrayBuffer();
      await flashFirmware(fileData);
    } catch (error) {
      toast.error('Failed to read the firmware file.');
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Firmware Flasher</CardTitle>
          <CardDescription>Update your Cardputer with the latest firmware.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="firmware-file">Firmware File (.bin)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="firmware-file"
                type="file"
                accept=".bin"
                onChange={handleFileChange}
                disabled={!isConnected || isFlashing}
                className="flex-grow"
              />
            </div>
            {file && (
              <div className="text-sm text-muted-foreground flex items-center gap-2 p-2 bg-secondary rounded-md">
                <FileCheck2 className="h-4 w-4 text-green-500" />
                <span>{file.name}</span>
                <button onClick={() => setFile(null)} disabled={isFlashing} className="ml-auto text-destructive hover:text-destructive/80">
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {isFlashing && (
            <div className="space-y-2 animate-pulse">
              <Label>Flashing Progress</Label>
              <Progress value={flashingProgress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">{flashingStatus}</p>
            </div>
          )}
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              Do not disconnect your device during the flashing process. Doing so may render your device unusable.
            </AlertDescription>
          </Alert>
          <Button
            size="lg"
            className="w-full gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
            onClick={handleFlash}
            disabled={!isConnected || !file || isFlashing}
          >
            {isFlashing ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-background border-t-transparent rounded-full" />
                Flashing...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Flash Firmware
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}