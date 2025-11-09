import { create } from 'zustand';



interface SerialPort {
  id?: string | number;

  [key: string]: unknown;
}interface SerialPort {id?: string | number;[key: string]: unknown;}export interface DeviceInfo {firmwareVersion: string;deviceName: string;platform: string;status: 'Idle' | 'Flashing' | 'Configuring';}export interface DeviceState {isSupported: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  port: SerialPort | null;
  deviceInfo: DeviceInfo | null;
  consoleOutput: string[];
}
export interface DeviceActions {
  setIsSupported: (isSupported: boolean) => void;
  setConnectionState: (state: 'connecting' | 'connected' | 'disconnected', port?: SerialPort | null) => void;
  setDeviceInfo: (info: DeviceInfo | null) => void;
  addConsoleOutput: (line: string) => void;
  clearConsole: () => void;
}
export const useDeviceStore = create<DeviceState & DeviceActions>((set) => ({
  isSupported: 'serial' in navigator,
  isConnected: false,
  isConnecting: false,
  port: null,
  deviceInfo: null,
  consoleOutput: [],
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
        set({ isConnecting: false, isConnected: false, port: null, deviceInfo: null });
        break;
    }
  },
  setDeviceInfo: (info) => set({ deviceInfo: info }),
  addConsoleOutput: (line) => set((state) => ({ consoleOutput: [...state.consoleOutput, line] })),
  clearConsole: () => set({ consoleOutput: [] })
}));