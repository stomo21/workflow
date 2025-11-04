import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

export enum EventType {
  ENTITY_CREATED = 'entity:created',
  ENTITY_UPDATED = 'entity:updated',
  ENTITY_DELETED = 'entity:deleted',
  APPROVAL_STATUS_CHANGED = 'approval:status:changed',
  DECISION_MADE = 'decision:made',
  CLAIM_UPDATED = 'claim:updated',
  EXCEPTION_RAISED = 'exception:raised',
  NOTIFICATION = 'notification',
}

export interface EventMessage {
  type: EventType;
  entityType: string;
  entityId: string;
  data: any;
  timestamp: Date;
  userId?: string;
}

export type EventHandler = (message: EventMessage) => void;

class WebSocketClient {
  private socket: Socket | null = null;
  private eventHandlers: Map<EventType, Set<EventHandler>> = new Map();
  private connected = false;

  connect(userId?: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(WS_URL, {
      query: { userId },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.connected = false;
    });

    this.socket.on('event', (message: EventMessage) => {
      this.handleEvent(message);
    });

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  subscribe(room: string) {
    if (this.socket) {
      this.socket.emit('subscribe', { room });
    }
  }

  unsubscribe(room: string) {
    if (this.socket) {
      this.socket.emit('unsubscribe', { room });
    }
  }

  on(eventType: EventType, handler: EventHandler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)!.add(handler);
  }

  off(eventType: EventType, handler: EventHandler) {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private handleEvent(message: EventMessage) {
    const handlers = this.eventHandlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => handler(message));
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export const wsClient = new WebSocketClient();
