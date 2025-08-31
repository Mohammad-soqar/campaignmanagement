// src/server/db/schema/_shared.ts
import { pgEnum } from 'drizzle-orm/pg-core';

export const platformEnum = pgEnum('platform', ['youtube', 'instagram', 'tiktok', 'x']);
