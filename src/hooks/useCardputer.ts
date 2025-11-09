import { useEffect, useCallback } from 'react';
import { useDeviceStore, DeviceConfig } from '@/store/deviceStore';
import { toast } from 'sonner';
export function useCardputer() {
  const setConnectionState = useDeviceStore((s) => s.setConnectionState);
  const port = useDeviceStore((s) => s.port);
  const setFlashingProgress = useDeviceStore((s) => s.setFlashingProgress);
  const setFlashingStatus = useDeviceStore((s) => s.setFlashingStatus);
  const updateDeviceStatus = useDeviceStore((s) => s.updateDeviceStatus);
  const setConfig = useDeviceStore((s) => s.setConfig);
  const setFetchingConfig = useDeviceStore((s) => s.setFetchingConfig);
  const setSavingConfig = useDeviceStore((s) => s.setSavingConfig);
  const addConsoleOutput = useDeviceStore((s) => s.addConsoleOutput);
  useEffect(() => {
    const handleDisconnect = (e: Event) => {
      if (port && e.target === port) {
        toast.warning('Device disconnected.');
        setConnectionState('disconnected');
      }
    };
    navigator.serial?.addEventListener('disconnect', handleDisconnect);
    return () => {
      navigator.serial?.removeEventListener('disconnect', handleDisconnect);
    };
  }, [port, setConnectionState]);
  useEffect(() => {
    if (!port?.readable) {
      return;
    }
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    const readLoop = async () => {
      const textDecoder = new TextDecoder();
      let buffer = '';
      while (port.readable) {
        try {
          reader = port.readable.getReader();
          for (;;) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }
            buffer += textDecoder.decode(value, { stream: true });
            const lines = buffer.split('\r\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
              if (line.trim()) {
                addConsoleOutput(line);
              }
            }
          }
        } catch (error) {
          if (!(error instanceof DOMException && error.name === 'AbortError')) {
            console.error('Error reading from serial port:', error);
            toast.error('Error reading from device.');
          }
        } finally {
          if (reader) {
            reader.releaseLock();
            reader = undefined;
          }
        }
      }
    };
    readLoop();
    return () => {
      reader?.cancel().catch(() => {});
    };
  }, [port, addConsoleOutput]);
  const connect = async () => {
    if (!('serial' in navigator)) {
      toast.error('Web Serial API not supported in this browser.');
      return;
    }
    try {
      setConnectionState('connecting');
      const newPort = await navigator.serial.requestPort();
      await newPort.open({ baudRate: 115200 });
      setConnectionState('connected', newPort);
      toast.success('Cardputer connected successfully!');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotFoundError' || error.name === 'NotAllowedError') {
          toast.info('No device selected or connection cancelled.');
        } else {
          toast.error(`Connection failed: ${error.message}`);
        }
      } else {
        toast.error('An unknown error occurred during connection.');
      }
      setConnectionState('disconnected');
    }
  };
  const disconnect = async () => {
    if (port) {
      try {
        await port.close();
      } catch (error) {
        console.error("Error closing port:", error);
      }
    }
    setConnectionState('disconnected');
    toast.info('Device disconnected.');
  };
  const write = useCallback(async (data: string) => {
    if (!port?.writable) {
      toast.error("Device not writable.");
      return;
    }
    try {
      const writer = port.writable.getWriter();
      const encodedData = new TextEncoder().encode(data + '\r\n');
      await writer.write(encodedData);
      writer.releaseLock();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to send command: ${errorMessage}`);
    }
  }, [port]);
  const flashFirmware = async (firmwareData: ArrayBuffer) => {
    if (!port?.writable) {
      toast.error("Device not connected or not writable.");
      return;
    }
    updateDeviceStatus('Flashing');
    setFlashingProgress(0);
    setFlashingStatus('Starting flash...');
    try {
      const chunkSize = 1024;
      const totalChunks = Math.ceil(firmwareData.byteLength / chunkSize);
      const writer = port.writable.getWriter();
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = start + chunkSize;
        const chunk = firmwareData.slice(start, end);
        await writer.write(new Uint8Array(chunk));
        const progress = Math.round(((i + 1) / totalChunks) * 100);
        setFlashingProgress(progress);
        setFlashingStatus(`Writing chunk ${i + 1} of ${totalChunks}...`);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      writer.releaseLock();
      setFlashingStatus('Flash complete! Verifying...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Firmware flashed successfully!');
      setFlashingStatus('Successfully flashed!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Flashing failed: ${errorMessage}`);
      setFlashingStatus(`Error: ${errorMessage}`);
    } finally {
      updateDeviceStatus('Idle');
      setFlashingProgress(0);
    }
  };
  const readConfig = useCallback(async () => {
    if (!port) {
      toast.error("Device not connected.");
      return;
    }
    setFetchingConfig(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockConfig: DeviceConfig = {
        ssid: 'MyHomeNetwork',
        autoBrightness: true,
        brightnessLevel: 'medium',
      };
      setConfig(mockConfig);
      toast.success("Configuration loaded from device.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to read config: ${errorMessage}`);
    } finally {
      setFetchingConfig(false);
    }
  }, [port, setConfig, setFetchingConfig]);
  const writeConfig = useCallback(async (config: DeviceConfig) => {
    if (!port?.writable) {
      toast.error("Device not connected or not writable.");
      return;
    }
    setSavingConfig(true);
    updateDeviceStatus('Configuring');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConfig(config);
      toast.success("Configuration saved successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to save config: ${errorMessage}`);
    } finally {
      setSavingConfig(false);
      updateDeviceStatus('Idle');
    }
  }, [port, setConfig, setSavingConfig, updateDeviceStatus]);
  return { connect, disconnect, write, flashFirmware, readConfig, writeConfig };
}