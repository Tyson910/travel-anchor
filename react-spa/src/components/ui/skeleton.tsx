import type * as React from "react";

import { cn } from "~/lib/utils";

function Skeleton({
	className,
	variant = "default",
	...props
}: React.ComponentProps<"div"> & {
	variant?: "default" | "technical" | "grid" | "data";
}) {
	return (
		<div
			data-slot="skeleton"
			className={cn(
				"animate-pulse",
				variant === "default" && "rounded-md bg-accent",
				variant === "technical" && "rounded-technical bg-muted",
				variant === "grid" &&
					"rounded-technical bg-muted relative overflow-hidden",
				variant === "data" &&
					"rounded-technical bg-muted font-sans text-xs tracking-tighter",

				className,
			)}
			{...props}
		>
			{variant === "grid" && (
				<div className="absolute inset-0 opacity-20">
					<div
						className="h-full w-full"
						style={{
							backgroundImage: `
							linear-gradient(to right, transparent 49%, rgba(0,0,0,0.1) 50%, transparent 51%),
							linear-gradient(to bottom, transparent 49%, rgba(0,0,0,0.1) 50%, transparent 51%)
						`,
							backgroundSize: "1rem 1rem",
						}}
					/>
				</div>
			)}
		</div>
	);
}

export { Skeleton };
