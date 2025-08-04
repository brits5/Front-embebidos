// src/services/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3002';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        upgrade: false,
      });

      this.socket.on('connect', () => {
        console.log('✅ Conectado al servidor WebSocket');
        this.socket.emit('join_room', { room: 'dashboard' });
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Desconectado del servidor WebSocket');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Error de conexión WebSocket:', error);
      });
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.socket) {
      this.connect();
    }
    
    this.socket.on(event, callback);
    
    // Guardar referencia para poder remover después
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
    
    // Remover de la lista de listeners
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
    }
    this.listeners.delete(event);
  }
}

// Crear instancia singleton
const socketService = new SocketService();
export default socketService;