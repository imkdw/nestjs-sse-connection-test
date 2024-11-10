import { Module } from '@nestjs/common';
import SseModule from './sse/sse.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [SseModule, EventEmitterModule.forRoot()],
})
export class AppModule {}
