import { Module } from '@nestjs/common';
import SseControler from './sse.controller.js';

@Module({
  controllers: [SseControler],
})
export default class SseModule {}
