import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Wifi, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeviceStore, DeviceConfig } from '@/store/deviceStore';
import { useCardputer } from '@/hooks/useCardputer';
import { toast } from 'sonner';
const initialFormState: DeviceConfig = {
  ssid: '',
  autoBrightness: false,
  brightnessLevel: 'medium',
};
function ConfigSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
export function ConfigurationEditor() {
  const { readConfig, writeConfig } = useCardputer();
  const isConnected = useDeviceStore((s) => s.isConnected);
  const storeConfig = useDeviceStore((s) => s.config);
  const isFetchingConfig = useDeviceStore((s) => s.isFetchingConfig);
  const isSavingConfig = useDeviceStore((s) => s.isSavingConfig);
  const [formState, setFormState] = useState<DeviceConfig>(initialFormState);
  useEffect(() => {
    if (isConnected && !storeConfig && !isFetchingConfig) {
      readConfig();
    }
  }, [isConnected, storeConfig, isFetchingConfig, readConfig]);
  useEffect(() => {
    if (storeConfig) {
      setFormState(storeConfig);
    }
  }, [storeConfig]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };
  const handleSwitchChange = (checked: boolean) => {
    setFormState(prev => ({ ...prev, autoBrightness: checked }));
  };
  const handleSelectChange = (value: 'low' | 'medium' | 'high') => {
    setFormState(prev => ({ ...prev, brightnessLevel: value }));
  };
  const handleSave = () => {
    if (!isConnected) {
      toast.error("Device not connected.");
      return;
    }
    writeConfig(formState);
  };
  const isWorking = isFetchingConfig || isSavingConfig;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Device Configuration</CardTitle>
          <CardDescription>Fine-tune your Cardputer ADV platform settings.</CardDescription>
        </CardHeader>
        <CardContent>
          {isFetchingConfig ? <ConfigSkeleton /> : (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Wifi className="h-5 w-5 text-primary" /> Wi-Fi Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ssid">SSID</Label>
                    <Input id="ssid" placeholder="Your Wi-Fi Name" value={formState.ssid} onChange={handleInputChange} disabled={!isConnected || isWorking} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="********" disabled={!isConnected || isWorking} />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Display Settings</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-brightness">Auto Brightness</Label>
                  <Switch id="auto-brightness" checked={formState.autoBrightness} onCheckedChange={handleSwitchChange} disabled={!isConnected || isWorking} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brightnessLevel">Brightness Level</Label>
                  <Select value={formState.brightnessLevel} onValueChange={handleSelectChange} disabled={!isConnected || isWorking}>
                    <SelectTrigger id="brightnessLevel">
                      <SelectValue placeholder="Select brightness" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button size="lg" className="w-full gap-2" onClick={handleSave} disabled={!isConnected || isWorking}>
                {isSavingConfig ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Configuration
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}