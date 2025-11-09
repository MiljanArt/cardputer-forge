import { create } from 'zustand';
// Note: The full SerialPort type is defined in src/types/web-serial.d.ts
// We use a simpler interface here for store state to avoid circular dependencies
// and to only store what's necessary. The actual port object will have more methods.
interface StoredSerialPort {
  [key: string]: unknown;
}
export interface DeviceInfo {
  firmwareVersion: string;
  deviceName: string;
  platform: string;
  status: 'Idle' | 'Flashing' | 'Configuring';
}
export interface DeviceConfig {
  ssid: string;
  autoBrightness: boolean;
  brightnessLevel: 'low' | 'medium' | 'high';
}
export interface DeviceState {
  isSupported: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  port: SerialPort | null;
  deviceInfo: DeviceInfo | null;
  consoleOutput: string[];
  flashingProgress: number;
  flashingStatus: string;
  config: DeviceConfig | null;
  isFetchingConfig: boolean;
  isSavingConfig: boolean;
}
export interface DeviceActions {
  setIsSupported: (isSupported: boolean) => void;
  setConnectionState: (state: 'connecting' | 'connected' | 'disconnected', port?: SerialPort | null) => void;
  setDeviceInfo: (info: DeviceInfo | null) => void;
  addConsoleOutput: (line: string) => void;
  clearConsole: () => void;
  setFlashingProgress: (progress: number) => void;
  setFlashingStatus: (status: string) => void;
  updateDeviceStatus: (status: DeviceInfo['status']) => void;
  setConfig: (config: DeviceConfig | null) => void;
  setFetchingConfig: (isFetching: boolean) => void;
  setSavingConfig: (isSaving: boolean) => void;
}
export const useDeviceStore = create<DeviceState & DeviceActions>((set, get) => ({
  isSupported: 'serial' in navigator,
  isConnected: false,
  isConnecting: false,
  port: null,
  deviceInfo: null,
  consoleOutput: [],
  flashingProgress: 0,
  flashingStatus: 'Ready to flash.',
  config: null,
  isFetchingConfig: false,
  isSavingConfig: false,
  setIsSupported: (isSupported) => set({ isSupported }),
  setConnectionState: (state, port = null) => {
    switch (state) {
      case 'connecting':
        set({ isConnecting: true, isConnected: false, port: null });
        break;
      case 'connected':
        set({
          isConnecting: false,
          isConnected: true,
          port,
          deviceInfo: {
            firmwareVersion: '1.0.0-adv',
            deviceName: 'Cardputer-ABCD',
            platform: 'ESP32-S3',
            status: 'Idle'
          }
        });
        break;
      case 'disconnected':
        set({ isConnecting: false, isConnected: false, port: null, deviceInfo: null, config: null });
        break;
    }
  },
  setDeviceInfo: (info) => set({ deviceInfo: info }),
  addConsoleOutput: (line) => set((state) => ({ consoleOutput: [...state.consoleOutput, line] })),
  clearConsole: () => set({ consoleOutput: [] }),
  setFlashingProgress: (progress) => set({ flashingProgress: progress }),
  setFlashingStatus: (status) => set({ flashingStatus: status }),
  updateDeviceStatus: (status) => {
    const { deviceInfo } = get();
    if (deviceInfo) {
      set({ deviceInfo: { ...deviceInfo, status } });
    }
  },
  setConfig: (config) => set({ config }),
  setFetchingConfig: (isFetching) => set({ isFetchingConfig: isFetching }),
  setSavingConfig: (isSaving) => set({ isSavingConfig: isSaving }),
}));