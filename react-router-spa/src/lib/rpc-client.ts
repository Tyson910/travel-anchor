import type { Router } from "@travel-anchor/data-access-layer";

import { createClient } from "better-call/client";

export const rpcClient = createClient<typeof Router>({
	baseURL: "http://localhost:3000/api",
});
