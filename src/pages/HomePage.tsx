import { AnimatePresence, motion } from 'framer-motion';
import { HardDrive, Zap, Settings, Terminal, Github } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { useDeviceStore } from '@/store/deviceStore';
import { ConnectDevice } from '@/components/ConnectDevice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeviceDashboard } from '@/components/DeviceDashboard';
import { FirmwareFlasher } from '@/components/FirmwareFlasher';
import { ConfigurationEditor } from '@/components/ConfigurationEditor';
import { DeviceConsole } from '@/components/DeviceConsole';
function AppHeader() {
  return (
    <header className="text-center space-y-2 mb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center gap-3"
      >
        <HardDrive className="h-10 w-10 text-indigo-500" />
        <h1 className="text-5xl font-bold tracking-tighter font-display bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-teal-500">
          Cardputer Forge
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground"
      >
        The ultimate web-based toolkit for your Cardputer ADV.
      </motion.p>
    </header>
  );
}
function MainInterface() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full"
    >
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard"><HardDrive className="h-4 w-4 mr-2" />Dashboard</TabsTrigger>
          <TabsTrigger value="firmware"><Zap className="h-4 w-4 mr-2" />Firmware</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="h-4 w-4 mr-2" />Settings</TabsTrigger>
          <TabsTrigger value="console"><Terminal className="h-4 w-4 mr-2" />Console</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-6">
          <DeviceDashboard />
        </TabsContent>
        <TabsContent value="firmware" className="mt-6">
          <FirmwareFlasher />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <ConfigurationEditor />
        </TabsContent>
        <TabsContent value="console" className="mt-6">
          <DeviceConsole />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
export function HomePage() {
  const isConnected = useDeviceStore((s) => s.isConnected);
  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans text-foreground">
        <ThemeToggle className="fixed top-4 right-4" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 md:py-16 lg:py-20">
            <AppHeader />
            <main>
              <AnimatePresence mode="wait">
                {isConnected ? <MainInterface key="interface" /> : <ConnectDevice key="connect" />}
              </AnimatePresence>
            </main>
          </div>
        </div>
        <footer className="absolute bottom-4 w-full text-center text-sm text-muted-foreground">
          <p>Built with ❤️ at Cloudflare</p>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
            <Github className="h-4 w-4" /> View on GitHub
          </a>
        </footer>
      </div>
      <Toaster richColors closeButton />
    </>
  );
}