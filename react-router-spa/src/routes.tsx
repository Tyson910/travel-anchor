import { createBrowserRouter, Outlet } from "react-router";

import { MinimalFooter } from "#components/layout/MinimalFooter.tsx";
import { MinimalHeader } from "#components/layout/MinimalHeader.tsx";

export const router = createBrowserRouter([
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
				element: <div className="bg-black">Hello World</div>,
			},
			{
				path: "/bread",
				element: <div className="bg-blue-300">Hello World</div>,
			},
		],
	},
]);
