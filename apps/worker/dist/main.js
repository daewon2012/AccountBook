"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const queues_1 = require("./queues");
const connection = { host: process.env.REDIS_HOST ?? '127.0.0.1', port: Number(process.env.REDIS_PORT ?? 6379) };
const queues = queues_1.QUEUE_NAMES.map((name) => new bullmq_1.Queue(name, { connection }));
async function shutdown() { await Promise.all(queues.map((queue) => queue.close())); }
process.once('SIGINT', () => void shutdown().finally(() => process.exit(0)));
process.once('SIGTERM', () => void shutdown().finally(() => process.exit(0)));
//# sourceMappingURL=main.js.map