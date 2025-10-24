import type { App } from "@travel-anchor/hono-api";

import { hc } from "hono/client";

export const honoClient = () => {
	return hc<App>(import.meta.env.VITE_PUBLIC_API_URL);
};
