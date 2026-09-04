import { Queue } from 'bullmq';
import { QUEUE_NAMES } from './queues';
const connection = { host: process.env.REDIS_HOST ?? '127.0.0.1', port: Number(process.env.REDIS_PORT ?? 6379) };
const queues = QUEUE_NAMES.map((name) => new Queue(name, { connection }));
async function shutdown(): Promise<void> { await Promise.all(queues.map((queue) => queue.close())); }
process.once('SIGINT', () => void shutdown().finally(() => process.exit(0)));
process.once('SIGTERM', () => void shutdown().finally(() => process.exit(0)));
