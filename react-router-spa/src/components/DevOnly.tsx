import type { PropsWithChildren } from "react";

import { cn } from "#src/lib/utils.ts";

export function DevOnly({
	children,
	className,
}: PropsWithChildren<{ className: string }>) {
	return (
		<pre
			className={cn(
				"mt-2 p-3 bg-muted rounded-md border text-xs overflow-x-auto max-h-[400px] overflow-auto",
				className,
			)}
		>
			{children}
		</pre>
	);
}
