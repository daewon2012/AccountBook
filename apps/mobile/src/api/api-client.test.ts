import { createApiClient } from './api-client';
describe('createApiClient',()=>{it('uses a secure production endpoint',()=>{expect(createApiClient('https://api.example.com').defaults.baseURL).toBe('https://api.example.com')});it('rejects an insecure remote endpoint',()=>{expect(()=>createApiClient('http://api.example.com')).toThrow('API base URL must use HTTPS')})});
