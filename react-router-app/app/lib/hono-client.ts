import type { App } from "@travel-anchor/hono-api";

import { hc } from "hono/client";

export const honoClient = () => {
	return hc<App>(`http://localhost:3000`);
};
