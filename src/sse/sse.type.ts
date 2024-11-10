import { SSE_EVENTS } from './sse.const.js';

export type SseEvents = (typeof SSE_EVENTS)[keyof typeof SSE_EVENTS];

export type Message = {
  event: SseEvents;
  content: string;
};
