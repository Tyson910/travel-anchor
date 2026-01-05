import type { LucideIcon } from "lucide-react";

interface LocationSpecDetailProps {
	children: React.ReactNode;
	Icon: LucideIcon;
}

export function LocationSpecDetail({
	children,
	Icon,
}: LocationSpecDetailProps) {
	return (
		<div className="inline-flex items-center gap-2 px-2 py-1 bg-muted self-start mt-2 border border-border rounded-sm">
			<Icon size={12} className="text-muted-foreground" />
			<span className="text-[10px] font-mono text-muted-foreground uppercase">
				{children}
			</span>
		</div>
	);
}
