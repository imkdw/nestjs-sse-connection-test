"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventsource_1 = __importDefault(require("eventsource"));
const uuid_1 = require("uuid");
class SSELoadTest {
    constructor(baseUrl = 'http://localhost:8080', targetConnections = 10000, rampUpTime = 300) {
        this.metrics = {
            total: 0,
            success: 0,
            failed: 0,
            active: 0,
            messageReceived: 0,
        };
        this.connections = new Map();
        this.baseUrl = baseUrl;
        this.targetConnections = targetConnections;
        this.rampUpTime = rampUpTime;
    }
    async start() {
        console.log('SSE 부하 테스트 시작');
        // 연결 생성 간격 계산 (밀리초)
        const connectionInterval = (this.rampUpTime * 1000) / this.targetConnections;
        // 점진적으로 연결 생성
        for (let i = 0; i < this.targetConnections; i++) {
            await this.createConnection();
            await new Promise((resolve) => setTimeout(resolve, connectionInterval));
        }
    }
    async createConnection() {
        const connectionId = (0, uuid_1.v4)();
        const url = `${this.baseUrl}/sse/connect/${connectionId}`;
        try {
            const es = new eventsource_1.default(url, {
                headers: {
                    Accept: 'text/event-stream',
                    'Cache-Control': 'no-cache',
                },
            });
            this.connections.set(connectionId, es);
            this.metrics.total++;
            this.metrics.active++;
            es.onopen = () => {
                this.metrics.success++;
                console.log(`SSE 연결 완료: ${connectionId}`);
            };
            es.onmessage = (event) => {
                this.metrics.messageReceived++;
                console.log(`메세지 수신 ${connectionId}: ${event.data}`);
            };
            es.onerror = (error) => {
                this.metrics.failed++;
                this.metrics.active--;
                this.connections.delete(connectionId);
                console.error(`커넥션 연결 실패 ${connectionId}:`, error);
                es.close();
            };
        }
        catch (error) {
            this.metrics.failed++;
            console.error(`커넥션 생성 실패 ${connectionId}:`, error);
        }
    }
    async shutdown() {
        console.log('Shutting down connections...');
        for (const [id, connection] of this.connections) {
            connection.close();
            this.connections.delete(id);
            this.metrics.active--;
        }
        console.log('All connections closed');
    }
}
// 메인 실행
const test = new SSELoadTest('http://localhost:8080', 10000, 60); // 1분 동안 10000개의 커넥션 생성
// Ctrl+C 핸들링
process.on('SIGINT', async () => {
    await test.shutdown();
    process.exit(0);
});
// 테스트 시작
test.start().catch(console.error);
