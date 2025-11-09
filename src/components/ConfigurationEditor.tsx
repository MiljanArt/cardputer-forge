import { motion } from 'framer-motion';
import { Save, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
export function ConfigurationEditor() {
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
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Wifi className="h-5 w-5 text-primary" /> Wi-Fi Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ssid">SSID</Label>
                <Input id="ssid" placeholder="Your Wi-Fi Name" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="********" disabled />
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Display Settings</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-brightness">Auto Brightness</Label>
              <Switch id="auto-brightness" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brightness">Brightness Level</Label>
              <Select disabled>
                <SelectTrigger id="brightness">
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
          <Button size="lg" className="w-full gap-2" disabled>
            <Save className="h-5 w-5" />
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}