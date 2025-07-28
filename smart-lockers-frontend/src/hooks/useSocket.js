import { useEffect, useRef, useCallback } from 'react';
import socketService from '../services/socket';

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = socketService.connect();

    return () => {
      if (socketRef.current) {
        socketService.disconnect();
      }
    };
  }, []);

  const on = useCallback((event, callback) => {
    socketService.on(event, callback);
  }, []);

  const off = useCallback((event, callback) => {
    socketService.off(event, callback);
  }, []);

  const emit = useCallback((event, data) => {
    socketService.emit(event, data);
  }, []);

  const removeAllListeners = useCallback((event) => {
    socketService.removeAllListeners(event);
  }, []);

  return {
    socket: socketRef.current,
    on,
    off,
    emit,
    removeAllListeners
  };
};