import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";

import "./index.css";

import { router } from "./routes.tsx";

const root = document.getElementById("root");

if (!root) throw new Error("Missing root element!");

createRoot(root).render(
	<StrictMode>
		<RouterProvider router={router} />,
	</StrictMode>,
);
