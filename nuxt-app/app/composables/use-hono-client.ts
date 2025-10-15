import type { App } from "@travel-anchor/hono-api";

import { hc } from "hono/client";

export const useHonoClient = () => {
	const { SITE_URL } = useRuntimeConfig().public;
	return hc<App>(`${SITE_URL}/backend`);
};
