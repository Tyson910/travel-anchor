import { app } from "./app.ts";

export default {
	fetch: app.fetch,
	port: process.env.PORT ?? 3000,
};
