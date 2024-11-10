import { Controller, Param, Post, Sse } from '@nestjs/common';
import { map, Subject } from 'rxjs';
import { Message } from './sse.type.js';
import { SSE_EVENTS } from './sse.const.js';

@Controller('sse')
export default class SseControler {
  private readonly connections: Map<string, Subject<Message>> = new Map();

  constructor() {}

  /**
   * IP를 기준으로 SSE 연결 생성
   */
  @Sse('connect/:ip')
  async connect(@Param('ip') ip: string) {
    this.connections.set(ip, new Subject<Message>());

    return this.connections
      .get(ip)
      .asObservable()
      .pipe(map((message) => ({ data: message })));
  }

  @Post('broadcast')
  async broadcast() {
    this.connections.forEach((connection) => {
      connection.next({
        event: SSE_EVENTS.BROADCAST,
        content: 'This is a broadcast message!',
      });
    });
  }

  @Post('partial')
  async partial() {
    // 전체 커넥션의 10%에게만 메세지 전송
    const connections = Array.from(this.connections.keys());

    // eslint-disable-next-line prettier/prettier
    const partialConnections = connections.slice(0, Math.floor(connections.length * 0.1));

    partialConnections.forEach((connection) => {
      this.connections.get(connection).next({
        event: SSE_EVENTS.PARTIAL,
        content: 'This is a partial message!',
      });
    });

    return { message: `Send to ${partialConnections.length} connections` };
  }
}
