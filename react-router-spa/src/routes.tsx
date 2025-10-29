import { createBrowserRouter, Outlet, type RouteObject } from "react-router";

import { MinimalFooter } from "#components/layout/MinimalFooter.tsx";
import { MinimalHeader } from "#components/layout/MinimalHeader.tsx";
import {
	SearchPage,
	searchPageLoader,
} from "#features/airport-search/index.tsx";
import { HomePage } from "#features/landing/route.tsx";

const routes = [
	{
		element: (
			<div className="min-h-screen bg-background flex flex-col">
				<MinimalHeader />
				<div className="flex-1">
					<Outlet />
				</div>
				<MinimalFooter />
			</div>
		),
		children: [
			{
				path: "/",
				Component: HomePage,
			},
			{
				path: "/search",
				loader: searchPageLoader,
				Component: SearchPage,
			},
		],
	},
] as const satisfies RouteObject[];

export const router = createBrowserRouter(routes);
