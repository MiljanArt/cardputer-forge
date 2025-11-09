import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDeviceStore } from '@/store/deviceStore';
import { Button } from './ui/button';
import { useCardputer } from '@/hooks/useCardputer';
import { LogOut } from 'lucide-react';
const InfoRow = ({ label, value }: { label: string; value: string | undefined }) => (
  <div className="flex justify-between items-center py-3 border-b last:border-b-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-semibold text-foreground">{value || 'N/A'}</span>
  </div>
);
export function DeviceDashboard() {
  const deviceInfo = useDeviceStore((s) => s.deviceInfo);
  const { disconnect } = useCardputer();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Device Status</CardTitle>
          <Badge variant={deviceInfo?.status === 'Idle' ? 'default' : 'secondary'} className="bg-teal-500 text-white">
            {deviceInfo?.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            <InfoRow label="Device Name" value={deviceInfo?.deviceName} />
            <InfoRow label="Firmware Version" value={deviceInfo?.firmwareVersion} />
            <InfoRow label="Platform" value={deviceInfo?.platform} />
          </div>
          <Button onClick={disconnect} variant="destructive" className="w-full mt-6 gap-2">
            <LogOut className="h-4 w-4" />
            Disconnect
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}