import { motion } from 'framer-motion';
import { Upload, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
export function FirmwareFlasher() {
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
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="firmware-file">Firmware File (.bin)</Label>
            <div className="flex items-center gap-2">
              <Input id="firmware-file" type="file" disabled />
              <Button variant="outline" disabled>
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Flashing Progress</Label>
            <Progress value={33} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">33% - Erasing flash...</p>
          </div>
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              Do not disconnect your device during the flashing process. Doing so may render your device unusable.
            </AlertDescription>
          </Alert>
          <Button size="lg" className="w-full gap-2" disabled>
            <Zap className="h-5 w-5" />
            Flash Firmware
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}