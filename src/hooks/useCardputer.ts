import { useEffect } from 'react';
import { useDeviceStore } from '@/store/deviceStore';
import { toast } from 'sonner';
export function useCardputer() {
  const setConnectionState = useDeviceStore((s) => s.setConnectionState);
  const port = useDeviceStore((s) => s.port);
  useEffect(() => {
    const handleDisconnect = () => {
      toast.warning('Device disconnected.');
      setConnectionState('disconnected');
    };
    if (navigator.serial) {
      navigator.serial.addEventListener('disconnect', handleDisconnect);
    }
    return () => {
      if (navigator.serial) {
        navigator.serial.removeEventListener('disconnect', handleDisconnect);
      }
    };
  }, [setConnectionState]);
  const connect = async () => {
    if (!('serial' in navigator)) {
      toast.error('Web Serial API not supported in this browser.');
      return;
    }
    try {
      setConnectionState('connecting');
      const newPort = await navigator.serial.requestPort();
      await newPort.open({ baudRate: 115200 });
      // In a real scenario, you'd communicate with the device to get info.
      // For now, we set mock info upon connection.
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
    if (port && port.readable) {
      // Reader needs to be cancelled before closing the port.
      // This logic will be expanded in later phases.
      try {
        await port.close();
      } catch (error) {
        console.error("Error closing port:", error);
      }
    }
    setConnectionState('disconnected');
    toast.info('Device disconnected.');
  };
  return { connect, disconnect };
}