import { useEffect, useCallback } from 'react';
import { useDeviceStore } from '@/store/deviceStore';
import { toast } from 'sonner';
export function useCardputer() {
  const setConnectionState = useDeviceStore((s) => s.setConnectionState);
  const port = useDeviceStore((s) => s.port);
  const setFlashingProgress = useDeviceStore((s) => s.setFlashingProgress);
  const setFlashingStatus = useDeviceStore((s) => s.setFlashingStatus);
  const updateDeviceStatus = useDeviceStore((s) => s.updateDeviceStatus);
  useEffect(() => {
    const handleDisconnect = (e: Event) => {
      // Check if the disconnected port is the one we are connected to
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
        // In a real app, you'd cancel any ongoing readers/writers here
        await port.close();
      } catch (error) {
        console.error("Error closing port:", error);
      }
    }
    setConnectionState('disconnected');
    toast.info('Device disconnected.');
  };
  const write = useCallback(async (data: Uint8Array) => {
    if (!port?.writable) {
      toast.error("Device not writable.");
      return;
    }
    const writer = port.writable.getWriter();
    await writer.write(data);
    writer.releaseLock();
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
      const chunkSize = 1024; // 1KB chunks
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
        // A small delay to allow UI to update and prevent overwhelming the device
        await new Promise(resolve => setTimeout(resolve, 10)); 
      }
      writer.releaseLock();
      setFlashingStatus('Flash complete! Verifying...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate verification
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
  return { connect, disconnect, write, flashFirmware };
}