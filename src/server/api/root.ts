import { itemRouter } from "./routers/itemRouter";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  items: itemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
