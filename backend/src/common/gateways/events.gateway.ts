import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

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

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');
  private connectedClients: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    this.connectedClients.set(client.id, userId);
    this.logger.log(`Client connected: ${client.id}, User: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    this.logger.log(`Client ${client.id} subscribed to ${data.room}`);
    return { event: 'subscribed', data: { room: data.room } };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.room);
    this.logger.log(`Client ${client.id} unsubscribed from ${data.room}`);
    return { event: 'unsubscribed', data: { room: data.room } };
  }

  // Broadcast to all connected clients
  broadcastEvent(message: EventMessage) {
    this.server.emit('event', message);
    this.logger.log(`Broadcasting event: ${message.type}`);
  }

  // Send to specific room
  sendToRoom(room: string, message: EventMessage) {
    this.server.to(room).emit('event', message);
    this.logger.log(`Sending event to room ${room}: ${message.type}`);
  }

  // Send to specific user
  sendToUser(userId: string, message: EventMessage) {
    const clientIds = Array.from(this.connectedClients.entries())
      .filter(([_, uid]) => uid === userId)
      .map(([clientId, _]) => clientId);

    clientIds.forEach((clientId) => {
      this.server.to(clientId).emit('event', message);
    });

    this.logger.log(`Sending event to user ${userId}: ${message.type}`);
  }

  // Notify about entity changes
  notifyEntityChange(
    type: EventType,
    entityType: string,
    entityId: string,
    data: any,
    userId?: string,
  ) {
    const message: EventMessage = {
      type,
      entityType,
      entityId,
      data,
      timestamp: new Date(),
      userId,
    };

    this.broadcastEvent(message);
  }
}
