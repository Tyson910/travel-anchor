import type { Router } from "@travel-anchor/data-access-layer";

import { createClient } from "better-call/client";

export const rpcClient = createClient<typeof Router>({
	baseURL: `${import.meta.env.VITE_PUBLIC_API_URL}/api`,
});
