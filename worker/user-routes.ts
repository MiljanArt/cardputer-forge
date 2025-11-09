import { Hono } from "hono";
import type { Env } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'Cardputer Forge API' }}));
}