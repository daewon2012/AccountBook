import { create } from 'axios';
export function createApiClient(baseURL: string) { if (!baseURL.startsWith('https://') && !baseURL.startsWith('http://localhost')) throw new Error('API base URL must use HTTPS'); return create({ baseURL, timeout: 10_000 }); }
