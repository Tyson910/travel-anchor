import { createBrowserRouter, Outlet, type RouteObject } from "react-router";

import { ErrorBoundary } from "#components/ErrorBoundary.tsx";
import { MinimalFooter } from "#components/layout/MinimalFooter.tsx";
import { MinimalHeader } from "#components/layout/MinimalHeader.tsx";

const routes = [
	{
		hydrateFallbackElement: null,
		element: (
			<div className="min-h-screen bg-background flex flex-col">
				<MinimalHeader />
				<div className="flex-1">
					<Outlet />
				</div>
				<MinimalFooter />
			</div>
		),
		ErrorBoundary: ErrorBoundary,
		children: [
			{
				path: "/",
				lazy: async () => {
					// load component before rendering
					const { HomePage } = await import("./features/landing/route");
					return { Component: HomePage };
				},
			},
			{
				path: "/search",
				lazy: async () => {
					// load component and loader before rendering
					const { SearchPage, searchPageLoader } = await import(
						"./features/airport-search/route"
					);
					return { Component: SearchPage, loader: searchPageLoader };
				},
			},
		],
	},
] as const satisfies RouteObject[];

export const router = createBrowserRouter(routes);
